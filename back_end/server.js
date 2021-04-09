const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { Sequelize } = require('sequelize');
const { initializeDatabase } = require("./src/utils.js")
const config = require("./config.js")
const socket_server = require('./src/socket')
const http = require("http")

// Init the app
const app = express()
app.use(cors({origin: "*"}))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set("json spaces", 2)

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
            // Init the API
            const port = 8080

            // Init socket server
            const server = new http.Server(app);
            socket_server(server, connection)

            // Import the routes
            require("./src/routes")(app, connection)

            // Start the API
            app.listen(port, () => {
                console.log("We are live on " + port);
            })

            // Start the socket server
            server.listen(port + 1, () => {
                console.log("We are live on " + (port + 1));
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
