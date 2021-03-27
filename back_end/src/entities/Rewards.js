const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initRewards = (connection) => {
    const Rewards = connection.define('Rewards', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        last_daily_coins_collected:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },

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
    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return Rewards;
}
