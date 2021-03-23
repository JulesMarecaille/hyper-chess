const utils = require("../utils.js");
const bcrypt = require("bcrypt-nodejs");
const config = require("../../config.js");
const rand = require("generate-key");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const {
    checkAuth,
    sendOkResponse,
    dynamicSort,
    sendForgotPasswordEmail,
    sendNewAccountEmail,
    createDefaultCollection,
    createDefaultDeck,
    validateEmail,
    validateUsername,
    validatePassword
} = require("../utils.js")

module.exports = (app, connection) => {
    const { User } = require("../entities")(connection)

    // Get all users
    app.get("/users", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            User.findAll().then((users) => {
                sendOkResponse(res, users)
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get leaderboard (top 100 users + current user position)
    app.get("/users/leaderboard", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            User.findAll({order: [['elo', 'DESC']], limit: 100}).then((users) => {
                sendOkResponse(res, users)
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get specific user
    app.get("/users/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((auth_user) => {
            User.scope('defaultScope').findOne({where: {id: req.params.id}}).then((user) => {
                sendOkResponse(res, user);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get specific user profile
    app.get("/users/:id/profile", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((auth_user) => {
            User.scope('defaultScope', 'gameResults').findOne({where: {id: req.params.id}}).then((user) => {
                user = user.toJSON()
                let game_results = user.white.concat(user.black);
                // sort inline
                game_results.sort(dynamicSort("created_at"))
                delete user.white
                delete user.black
                user.game_results = game_results
                sendOkResponse(res, user);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Login
    app.post("/login", (req, res) => {
        User.scope("logging").findOne({attributes: ['password'], where: {"email": req.body.email}}).then((found_user) => {
            bcrypt.compare(req.body.password, found_user.password, (erro, result) => {
                if (result) {
                    const token = jwt.sign({ id: found_user.id }, config.secret);
                    User.findOne({where: {id: found_user.id}}).then((user) => {
                        sendOkResponse(res, {user, token});
                    })
                    .catch((err) => {
                        res.status(404).send("No user");
                    });
                } else {
                    res.status(401).send("Wrong password");
                }
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Create a new user
    app.post("/users", (req, res) => {
        User.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {name: req.body.name}
                ]
            }
        }).then((existing_user) => {
            if (existing_user) {
                res.status(500).send("The username or email is already taken");
            } else if (!validateEmail(req.body.email) || !validateUsername(req.body.name) || !validatePassword(req.body.password)){
                res.status(500).send("Email, name or password is invalid");
            } else {
                const new_user = User.build(req.body);
                const salt = bcrypt.genSaltSync(10);
                new_user.password = bcrypt.hashSync(req.body.password, salt);
                const collection = createDefaultCollection(connection, new_user.id);
                const deck = createDefaultDeck(connection, new_user.id)
                new_user.save().then(async (new_user) => {
                    delete new_user.password;
                    sendOkResponse(res, new_user);
                    await collection.save();
                    await deck.save();
                    sendNewAccountEmail(req.body.email);
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    app.post("/users/reset_password", (req, res) => {
        User.scope("logging").findOne({where : {email: req.body.email}}).then(async (user) => {
            if (user) {
                user.password = "reset";
                const reset_password_code = rand.generateKey();
                await sendForgotPasswordEmail(user.email, reset_password_code);
                const salt = bcrypt.genSaltSync(10);
                user.reset_token = bcrypt.hashSync(reset_password_code, salt);
                user.save().then((updated_user) => {
                    sendOkResponse(res, {email: user.email});
                })
                .catch((err) => {
                    res.status(500).send();
                });
            } else {
                res.status(204).send();
            }
        })
        .catch((err) => {
            res.status(500).send();
        });
    });

    app.post("/users/new_password", (req, res) => {
        User.scope("logging").findOne({where: {email: req.body.email}}).then((found_user) => {
            if (found_user) {
                bcrypt.compare(req.body.reset_token, found_user.reset_token, (erro, result) => {
                    if (result && validatePassword(req.body.password)) {
                        found_user.reset_token = null;
                        const salt = bcrypt.genSaltSync(10);
                        found_user.password = bcrypt.hashSync(req.body.password, salt);
                        found_user.save().then((updated_user) => {
                            sendOkResponse(res, {email: found_user.email});
                        })
                        .catch((err) => {
                            res.status(500).send();
                        });
                    } else {
                        res.status(500).send("Password incorrect.");
                    }
                });
            } else {
                res.status(500).send("No user found.");
            }
        })
        .catch((err) => {
            res.status(500).send();
        });
    });
}
