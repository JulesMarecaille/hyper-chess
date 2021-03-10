const User = require("../entities/User.js");
const utils = require("../utils.js");

module.exports = (app, connection) => {
    app.get("/users", (req, res) => {
        utils.sendOkResponse(res, {})
    });
}
