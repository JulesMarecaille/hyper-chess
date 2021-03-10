const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { Sequelize } = require('sequelize');

// Connect to the DB
let connection = null

// Initialize entities
require("./src/entities")(connection)
/*
const sequelize = new Sequelize('sqlite::memory:', {
  define: {
    freezeTableName: true
  }
});
*/

// Init the app
const port = 5000
const app = express()
app.use(cors({origin: "*"}))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set("json spaces", 2)

// Import the routes
require("./src/routes")(app, connection)

// Start the app
app.listen(port, () => {
  console.log("We are live on " + port);
})
