const {initDeck} = require("./Deck.js");
const {initUser} = require("./User.js");
const {initGameOffer} = require("./GameOffer.js");
const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const User = initUser(connection)
    const Deck = initDeck(connection)
    const GameOffer = initGameOffer(connection)

    User.hasMany(Deck, {
      foreignKey: 'UserId'
    });
    Deck.belongsTo(User);

    User.addScope('decks', {
        include: [
            { model: Deck }
        ]
    });
    User.hasOne(GameOffer, {
        foreignKey: 'UserId'
    });
    GameOffer.belongsTo(User);
    GameOffer.addScope('user', {
        include: [
            { model: User }
        ]
    })
    return { User, Deck, GameOffer }
}
