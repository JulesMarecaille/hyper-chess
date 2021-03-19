const {initDeck} = require("./Deck.js");
const {initUser} = require("./User.js");
const {initCollection} = require("./Collection.js");
const {initGameResult} = require("./GameResult.js");
const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const User = initUser(connection)
    const Deck = initDeck(connection)
    const Collection = initCollection(connection)
    const GameResult = initGameResult(connection)

    // Add relations
    User.hasMany(Deck, {
      foreignKey: 'UserId'
    });
    Deck.belongsTo(User);

    User.hasOne(Collection, {
      foreignKey: 'UserId'
    });
    Collection.belongsTo(User);

    GameResult.belongsTo(User, {
        as: 'white',
        foreignKey: 'whiteId'
    });

    GameResult.belongsTo(User, {
        as: 'black',
        foreignKey: 'blackId'
    });

    User.hasMany(GameResult, {
        as: 'black',
        foreignKey: 'blackId'
    });
    User.hasMany(GameResult, {
        as: 'white',
        foreignKey: 'whiteId'
    });

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
    User.addScope('gameResults', {
        include: [
            { model: GameResult, as: "white", separate : true, limit: 10 },
            { model: GameResult, as: "black", separate : true, limit: 10 }
        ]
    });
    return { User, Deck, Collection, GameResult }
}
