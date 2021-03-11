const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { Sequelize } = require('sequelize');
const { initializeDatabase } = require("./src/utils.js")
const config = require("./config.js")

// Connect to the DB
const connection = new Sequelize(
    'postgres://postgres:'+ config.db_password + '@' + config.db_adress + ':5432/hyperchess',
    {
        define: {
            freezeTableName: true
        }
    }
);

connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    // Initialize entities
    require("./src/entities")(connection)

    connection.sync({alter: true}).then(() => {
        console.log('Database synced.');
        // Create placeholders
        initializeDatabase(connection).then(() => {
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
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });

})
.catch((err) => {
    console.log(err);
});
