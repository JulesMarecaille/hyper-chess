const userRoutes = require("./userRoutes.js");
const deckRoutes = require("./deckRoutes.js");
const gameOfferRoutes = require("./gameOfferRoutes.js");

module.exports = (app, connection) => {
    userRoutes(app, connection);
    deckRoutes(app, connection);
    gameOfferRoutes(app, connection);
};
