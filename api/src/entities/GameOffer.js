const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports.initGameOffer = (connection) => {
    const GameOffer = connection.define('GameOffer', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }
    }, {
        defaultScope: {
        },
        scopes: {
        }
    })
    return GameOffer;
}
