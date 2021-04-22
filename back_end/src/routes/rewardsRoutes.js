const { checkAuth, sendOkResponse } = require("../utils.js")
const { DAILY_REWARD_COINS } = require("hyperchess_model/constants")
const { MISSION_MAPPING } = require("hyperchess_model/missions")

module.exports = (app, connection) => {
    const { Rewards } = require("../entities")(connection)

    // Get rewards from user
    app.get("/rewards/user/:id", (req, res, next) => {
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
    app.get("/rewards/collect_daily_reward", (req, res, next) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Rewards.findOne({where: {UserId: user.id}}).then((rewards) => {
                if(!rewards.last_daily_coins_collected || rewards.last_daily_coins_collected < new Date().setHours(0, 0, 0, 0)){
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

    // Get rewards from user
    app.get("/rewards/get_new_mission", (req, res, next) => {
        checkAuth(connection, req.headers["x-access-token"]).then((user) => {
            Rewards.findOne({where: {UserId: user.id}}).then((rewards) => {
                if(!rewards.last_new_mission || rewards.last_new_mission < new Date().setHours(0, 0, 0, 0)){
                    if(!rewards.mission_1_name){
                        rewards.mission_1_name = getNewMission();
                    } else if(!rewards.mission_2_name){
                        rewards.mission_2_name = getNewMission();
                    } else if(!rewards.mission_3_name){
                        rewards.mission_3_name = getNewMission();
                    }
                    rewards.last_new_mission = new Date();
                    rewards.save().then(() => {
                        sendOkResponse(res, rewards);
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

function getNewMission(){
    return Object.keys(MISSION_MAPPING)[Math.floor(Math.random() * (Object.keys(MISSION_MAPPING).length - 1))]
}
