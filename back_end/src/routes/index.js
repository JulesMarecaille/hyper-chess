const userRoutes = require("./userRoutes.js");
const deckRoutes = require("./deckRoutes.js");
const collectionsRoutes = require("./collectionsRoutes.js");
const rewardsRoutes = require("./rewardsRoutes.js");

module.exports = (app, connection) => {
    userRoutes(app, connection);
    deckRoutes(app, connection);
    collectionsRoutes(app, connection);
    rewardsRoutes(app, connection)
};
