const { checkAuth, sendOkResponse } = require("../utils.js")

module.exports = (app, connection) => {
    const { Rewards } = require("../entities")(connection)

    // Get rewards from user
    app.get("/rewards/user/:id", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            if(user.id === req.params.id){
                Rewards.findOne({where: {UserId: req.params.id}}).then((rewards) => {
                    sendOkResponse(res, rewards);
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
    });

    // Get rewards from user
    app.get("/rewards/collect_daily_reward", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Rewards.findOne({where: {UserId: user.id}}).then((rewards) => {
                if(rewards.last_daily_coins_collected < new Date().setHours(0, 0, 0, 0)){
                    user.coins += 50;
                    user.save().then(() => {
                        sendOkResponse(res, {});
                        rewards.last_daily_coins_collected = new Date();
                        rewards.save();
                    })
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
}
