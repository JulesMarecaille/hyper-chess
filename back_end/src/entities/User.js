const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initUser = (connection) => {
    const User = connection.define('User', {
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

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password:{
            type: DataTypes.STRING,
            allowNull: false
        },

        reset_token:{
            type: DataTypes.STRING,
            allowNull: true
        },

        elo: {
            type: DataTypes.INTEGER,
            defaultValue: 1000,
            allowNull: false
        }
    }, {
        defaultScope: {
            attributes: ["id", "created_at", "name", "elo"]
        },
        scopes: {
            logging: {
                attributes: ["id", "email", "password", "reset_token"]
            }
        }
    })
    return User;
}
