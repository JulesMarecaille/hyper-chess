const {initDeck} = require("./Deck.js");
const {initUser} = require("./User.js");
const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const User = initUser(connection)
    const Deck = initDeck(connection)

    User.hasMany(Deck, {
      foreignKey: 'UserId'
    });
    Deck.belongsTo(User);

    User.addScope('decks', {
        include: [
            { model: Deck }
        ]
    });
    return { User, Deck }
}
