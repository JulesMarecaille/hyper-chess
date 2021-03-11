const bcrypt = require("bcrypt-nodejs");
const User = require("../entities/User.js");
const Deck = require("../entities/Deck.js");
const jwt = require("jsonwebtoken");
const { checkAuth, sendOkResponse } = require("../utils.js")

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

    // Update deck
    app.put("/deck/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findOne({where: {id: req.params.id}}).then((found_deck) => {
                if (found_deck.UserId == user.id){
                    req.body.id = req.params.id;
                    Deck.update(req.body).then((deck) => {
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
    app.post("/deck", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            req.body.UserId = user.id;
            Deck.create(req.body).then((deck) => {
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

    // Delete deck
    app.delete("/deck/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Deck.findOne({where: {id: req.params.id}}).then((found_deck) => {
                if (found_deck.UserId == user.id){
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
