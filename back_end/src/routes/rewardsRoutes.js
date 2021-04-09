const { checkAuth, sendOkResponse } = require("../utils.js")
const { DAILY_REWARD_COINS } = require("hyperchess_model/constants")

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
                    next(err)
                });
            } else {
                res.status(401).send();
            }
        })
        .catch((err) => {
            next(err)
        });
    });

    // Get rewards from user
    app.get("/rewards/collect_daily_reward", (req, res) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Rewards.findOne({where: {UserId: user.id}}).then((rewards) => {
                if(rewards.last_daily_coins_collected < new Date().setHours(0, 0, 0, 0)){
                    user.coins += DAILY_REWARD_COINS;
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
                next(err)
            });
        })
        .catch((err) => {
            next(err)
        });
    });
}
