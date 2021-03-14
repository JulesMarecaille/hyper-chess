const bcrypt = require("bcrypt-nodejs");
const User = require("../entities/User.js");
const GameOffer = require("../entities/GameOffer.js");
const jwt = require("jsonwebtoken");
const { checkAuth, sendOkResponse } = require("../utils.js")

module.exports = (app, connection) => {
    const { GameOffer } = require("../entities")(connection)

    // Get all gameoffers
    app.get("/gameoffers", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            GameOffer.scope('user').findAll().then((gameoffers) => {
                //{where: "UserId": {[connection.Op.not]: user.id}}
                sendOkResponse(res, gameoffers)
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get specific gameoffer
    app.get("/gameoffers/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            GameOffer.scope('user').findOne({where: {id: req.params.id}}).then((gameoffer) => {
                sendOkResponse(res, gameoffer);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Update gameoffer
    app.put("/gameoffers/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            GameOffer.findOne({where: {id: req.params.id}}).then((found_gameoffer) => {
                if (found_gameoffer.UserId == user.id){
                    req.body.id = req.params.id;
                    GameOffer.update(req.body).then((gameoffer) => {
                        sendOkResponse(res, gameoffer);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
                } else {
                    res.status(401).send();
                }
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Create gameoffer
    app.post("/gameoffers", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            req.body.UserId = user.id;
            GameOffer.create(req.body).then((gameoffer) => {
                sendOkResponse(res, gameoffer);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Delete gameoffer
    app.delete("/gameoffers/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            GameOffer.findOne({where: {id: req.params.id}}).then((found_gameoffer) => {
                if (found_gameoffer.UserId == user.id){
                    GameOffer.destroy({where: {id: req.params.id}}).then((gameoffer) => {
                        sendOkResponse(res, gameoffer);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
                } else {
                    res.status(401).send();
                }
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    })
}
