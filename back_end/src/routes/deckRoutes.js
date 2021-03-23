const { checkAuth, sendOkResponse } = require("../utils.js")
const { Op } = require("sequelize");

module.exports = (app, connection) => {
    const { Deck } = require("../entities")(connection)

    // Get all decks
    app.get("/decks", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findAll().then((decks) => {
                sendOkResponse(res, decks)
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get specific deck
    app.get("/decks/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findOne({where: {id: req.params.id}}).then((deck) => {
                sendOkResponse(res, deck);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get all decks from user
    app.get("/decks/user/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findAll({where: {UserId: req.params.id}}).then((decks) => {
                sendOkResponse(res, decks);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Get selected decks from user
    app.get("/decks/user/:id/selected", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findAll({where: {
                UserId: req.params.id,
                [Op.or]: [
                    {selected_as_white: true},
                    {selected_as_black: true}
                ]
            }}).then((decks) => {
                let payload = {}
                if(decks[0].selected_as_white){
                    payload["white"] = decks[0];
                    payload["black"] = decks[1];
                } else {
                    payload["white"] = decks[1];
                    payload["black"] = decks[0];
                }
                sendOkResponse(res, payload);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    })

    // Update deck
    app.put("/decks/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"], ["defaultScope", "decks"]).then((user) => {
            Deck.findOne({where: {id: req.params.id}}).then((found_deck) => {
                // TODO : Add a selected_as_* check
                if (found_deck.UserId == user.id){
                    req.body.id = req.params.id;
                    found_deck.update(req.body).then((deck) => {
                        sendOkResponse(res, deck);
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

    // Create deck
    app.post("/decks", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"], ["defaultScope", "decks"]).then((user) => {
            req.body.UserId = user.id;
            if(user.Decks.length <= 9){
                Deck.create(req.body).then((deck) => {
                    sendOkResponse(res, deck);
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
            } else {
                res.status(401).send("You already have 9 decks");
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Delete deck
    app.delete("/decks/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"], ["defaultScope", "decks"]).then((user) => {
            Deck.findOne({where: {id: req.params.id}}).then((found_deck) => {
                if (found_deck.UserId == user.id && user.Decks.length === 1){
                    Deck.destroy({where: {id: req.params.id}}).then((deck) => {
                        sendOkResponse(res, deck);
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
