const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initDeck = (connection) => {
    const Deck = connection.define('Deck', {
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

        pieces: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull:false,
            defaultValue: []
        },

        selected_as_white: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

        selected_as_black:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        defaultScope: {
        },
        scopes: {
        }
    });
    return Deck;
}
