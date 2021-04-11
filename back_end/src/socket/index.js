const socketio = require('socket.io');
const lobbyManager = require('./lobbyManager')
const { checkAuthNoDatabase } = require('../utils')
const cors = require("cors");
const logger = require("../logging/logger")

module.exports = (server, connection) => {
    const io = socketio(server, {
        cors: {origin: "*"}
    });
    // Game mode
    io.on('connection', async (socket) => {
        // Receive info from the client
        const token = socket.handshake.query.token;
        checkAuthNoDatabase(token).then((user_id) => {
            lobbyManager.connection(io, socket, connection, user_id)
        }).catch((err) => {
            socket.emit('status' , "Couldn't authenticate the token.");
            logger.error("Couldn't connect socket :", err)
            socket.disconnect();
        });
    });

  return io;
};
