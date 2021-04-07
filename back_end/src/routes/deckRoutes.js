const { checkAuth, sendOkResponse } = require("../utils.js")
const { Op } = require("sequelize");
const { WHITE, BLACK } = require("hyperchess_model/constants")
const { getAllowedPosition } = require("hyperchess_model")

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
                if(decks.length === 1) {
                    payload[WHITE] = decks[0];
                    payload[BLACK] = decks[0];
                } else if(decks[0].selected_as_white && decks[1].selected_as_black){
                    payload[WHITE] = decks[0];
                    payload[BLACK] = decks[1];
                } else if(decks[1].selected_as_white && decks[0].selected_as_black){
                    payload[WHITE] = decks[1];
                    payload[BLACK] = decks[0];
                } else {
                    res.status(500).send(err);
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
                if (found_deck.UserId == user.id){
                    req.body.id = req.params.id;
                    let valid = true;
                    if(req.body.pieces){
                        valid = valid && isDeckValid(req.body.pieces)
                    }
                    if(req.body.selected_as_white){
                        Deck.findAll({where: {UserId: user.id, selected_as_white: true}}).then((decks) => {
                            for(let deck of decks){
                                deck.selected_as_white = false;
                                deck.save()
                            }
                        })
                    }
                    if(req.body.selected_as_black){
                        Deck.findAll({where: {UserId: user.id, selected_as_black: true}}).then((decks) => {
                            for(let deck of decks){
                                deck.selected_as_black = false;
                                deck.save()
                            }
                        })
                    }
                    if(valid){
                        found_deck.update(req.body).then((deck) => {
                            sendOkResponse(res, deck);
                        })
                        .catch((err) => {
                            res.status(500).send(err);
                        });
                    } else {
                        res.status(401).send();
                    }
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
                if (found_deck.UserId == user.id && user.Decks.length > 1 && !found_deck.selected_as_white && !found_deck.selected_as_black){
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

function isDeckValid(pieces){
    let has_king = false;
    let number_of_pawns = 0;
    let value = 0;
    let invalid_piece = false;
    for(let i=0; i < pieces.length; i++){
        if(pieces[i]){
            let piece = new PIECE_MAPPING[pieces[i]](WHITE);
            if(i < 8){
                number_of_pawns += 1;
            }
            if(piece.is_king){
                has_king = true
            }
            if(!getAllowedPosition(piece.allowed).includes(i)){
                invalid_piece = true
            }
            value += piece.value;
        }
    }
    return (has_king && !(number_of_pawns < 8) && value <= 40 && !invalid_piece)
}
