const userRoutes = require("./userRoutes.js");
const deckRoutes = require("./deckRoutes.js");

module.exports = (app, connection) => {
    userRoutes(app, connection);
    deckRoutes(app, connection);
};
