const utils = require("../utils.js");
const bcrypt = require("bcrypt-nodejs");
const config = require("../../config.js");
const jwt = require("jsonwebtoken");
const { checkAuth, sendOkResponse } = require("../utils.js")

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
                console.log(users)
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

    // Get specific user (for profile)
    app.get("/users/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
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
        User.findOne({where : {email: req.body.email}}).then((existing_user) => {
            if (existing_user) {
                res.status(500).send();
            } else {
                const new_user = User.build(req.body);
                const salt = bcrypt.genSaltSync(10);
                new_user.password = bcrypt.hashSync(req.body.password, salt);
                // if (req.body.password) {
                //     new_user.password = bcrypt.hashSync(req.body.password, salt);
                // }
                // else {
                //     const reset_password_code = rand.generateKey();
                //     sendNewAccountEmail(new_user.email, reset_password_code).catch((err) => {
                //         console.log(err);
                //     });
                //     new_user.reset_password_code = bcrypt.hashSync(reset_password_code, salt);
                // }
                new_user.save().then((new_user) => {
                    delete new_user.password;
                    sendOkResponse(res, new_user);
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
}
