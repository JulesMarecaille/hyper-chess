const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initGameResult = (connection) => {
    const GameResult = connection.define('GameResult', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        created_at:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },

        white_name:{
            type: DataTypes.STRING,
            allowNull: false
        },

        black_name:{
            type: DataTypes.STRING,
            allowNull: false
        },

        white_elo:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        black_elo:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        draw:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        white_won:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        number_of_half_moves:{
            type: DataTypes.INTEGER,
        },

        time:{
            type: DataTypes.INTEGER,
        },

        time_increment:{
            type: DataTypes.INTEGER,
        }

    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return GameResult;
}
