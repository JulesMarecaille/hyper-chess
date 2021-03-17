const { checkAuth, sendOkResponse } = require("../utils.js")

module.exports = (app, connection) => {
    const { Collection } = require("../entities")(connection)

    // Get all collections
    // app.get("/collections", (req, res) => {
    //     checkAuth(connection, req.headers["x-access-token"]).then((user) => {
    //         Collection.findAll().then((collections) => {
    //             sendOkResponse(res, collections)
    //         })
    //         .catch((err) => {
    //             res.status(500).send(err);
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    // });

    // Get specific collection
    // app.get("/collections/:id", (req, res) => {
    //     checkAuth(connection, req.headers["x-access-token"]).then((user) => {
    //         Collection.findOne({where: {id: req.params.id}}).then((collection) => {
    //             sendOkResponse(res, collection);
    //         })
    //         .catch((err) => {
    //             res.status(500).send(err);
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    // });

    // Get collection from user
    app.get("/collections/user/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Collection.findOne({where: {UserId: req.params.id}}).then((collection) => {
                delete collection.dataValues.id;
                delete collection.dataValues.updatedAt;
                delete collection.dataValues.createdAt;
                delete collection.dataValues.UserId;
                sendOkResponse(res, collection);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });

    // Update collection
    app.put("/collections/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Collection.findOne({where: {id: req.params.id}}).then((found_collection) => {
                if (found_collection.UserId == user.id){
                    req.body.id = req.params.id;
                    Collection.update(req.body).then((collection) => {
                        sendOkResponse(res, collection);
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

    // Create collection
    // app.post("/collections", (req, res) => {
    //     checkAuth(connection, req.headers["x-access-token"]).then((user) => {
    //         req.body.UserId = user.id;
    //         Collection.create(req.body).then((collection) => {
    //             sendOkResponse(res, collection);
    //         })
    //         .catch((err) => {
    //             res.status(500).send(err);
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    // });

    // Delete collection
    // app.delete("/collections/:id", (req, res) => {
    //     checkAuth(connection, req.headers["x-access-token"]).then((user) => {
    //         Collection.findOne({where: {id: req.params.id}}).then((found_collection) => {
    //             if (found_collection.UserId == user.id){
    //                 Collection.destroy({where: {id: req.params.id}}).then((collection) => {
    //                     sendOkResponse(res, collection);
    //                 })
    //                 .catch((err) => {
    //                     res.status(500).send(err);
    //                 });
    //             } else {
    //                 res.status(401).send();
    //             }
    //         })
    //         .catch((err) => {
    //             res.status(500).send(err);
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     });
    // })
}
