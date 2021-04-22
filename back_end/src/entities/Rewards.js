const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initRewards = (connection) => {
    const Rewards = connection.define('Rewards', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        // Daily Reward
        last_daily_coins_collected:{
            type: DataTypes.DATE,
        },

        // Game coins
        last_game_coins_collected: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        todays_coins_collected:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        // Missions
        mission_1_name:{
            type: DataTypes.STRING
        },
        mission_1_value:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        mission_2_name:{
            type: DataTypes.STRING
        },
        mission_2_value:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        mission_3_name:{
            type: DataTypes.STRING
        },
        mission_3_value:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        last_new_mission:{
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },

        // Achievements
        PlayXGames:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        CaptureXPieces:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        GiveXChecks:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        GiveXCheckmates:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        PromoteXPawns:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return Rewards;
}
