const {initDeck} = require("./Deck.js");
const {initUser} = require("./User.js");
const {initCollection} = require("./Collection.js");
const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const User = initUser(connection)
    const Deck = initDeck(connection)
    const Collection = initCollection(connection)

    // Add relations
    User.hasMany(Deck, {
      foreignKey: 'UserId'
    });
    Deck.belongsTo(User);

    User.hasOne(Collection, {
      foreignKey: 'UserId'
    });
    Collection.belongsTo(User);

    // Add scopes
    User.addScope('decks', {
        include: [
            { model: Deck }
        ]
    });
    User.addScope('collection', {
        include: [
            { model: Collection }
        ]
    });
    return { User, Deck, Collection }
}
