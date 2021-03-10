const User = require("../entities/User.js");
const Deck = require("../entities/Deck.js");
const utils = require("../utils.js")

module.exports = (app, connection) => {
    app.get("/decks", (req, res) => {
        utils.sendOkResponse(res, {})
    });
}
