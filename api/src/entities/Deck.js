const { Model } = require('sequelize');
class Deck extends Model{}
module.exports.Deck = Deck
module.exports.initDeck = (connection) => {
    Deck.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },

        create_at:{
            type: DataTypes.DATETIME,
            defaultValue: Sequelize.NOW
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        elo: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
    }, {
        connection,
        modelName: 'deck'
    })
}
