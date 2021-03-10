const {Deck, initDeck} = require("./Deck.js");
const {User, initUser} = require("./User.js");
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (connection) => {
    initUser(connection)
    initDeck(connection)

    User.hasMany(Deck, {
      foreignKey: 'user_id'
    });
    Deck.belongsTo(Player);
}
