const { checkAuth, sendOkResponse } = require("../utils.js")
const { PIECE_MAPPING } = require("hyperchess_model/pieces")

module.exports = (app, connection) => {
    const { Collection } = require("../entities")(connection)

    // Get collection from user
    app.get("/collections/user/:id", (req, res, next) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Collection.findOne({where: {UserId: req.params.id}}).then((collection) => {
                delete collection.dataValues.id;
                delete collection.dataValues.updatedAt;
                delete collection.dataValues.createdAt;
                delete collection.dataValues.UserId;
                sendOkResponse(res, collection);
            })
            .catch((err) => {
                next(err)
            });
        })
        .catch((err) => {
            next(err)
        });
    });

    // Update collection
    app.put("/collections/:id", (req, res, next) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Collection.findOne({where: {id: req.params.id}}).then((found_collection) => {
                if (found_collection.UserId == user.id){
                    req.body.id = req.params.id;
                    Collection.update(req.body).then((collection) => {
                        sendOkResponse(res, collection);
                    })
                    .catch((err) => {
                        next(err)
                    });
                } else {
                    res.status(401).send();
                }
            })
            .catch((err) => {
                next(err)
            });
        })
        .catch((err) => {
            next(err)
        });
    });

    //Buy piece
    app.get("/collections/unlock/:piece", (req, res, next) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Collection.findOne({where: {UserId: user.id}}).then((collection) => {
                let cost = new PIECE_MAPPING[req.params.piece](null).cost;
                if(user.coins - cost > 0){
                    user.coins = user.coins - cost;
                    let data = {};
                    data[req.params.piece] = true;
                    collection.update(data).then(() => {
                        sendOkResponse(res, {});
                        user.save();
                    })
                } else {
                    res.status(401).send(err);
                }

            })
            .catch((err) => {
                next(err)
            });
        })
        .catch((err) => {
            next(err)
        });
    });
}
