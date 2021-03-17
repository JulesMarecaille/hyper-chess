const socketio = require('socket.io');
const lobbyManager = require('./lobbyManager')
const { checkAuthNoDatabase } = require('../utils')
const cors = require("cors");

module.exports = (server, connection) => {
    const io = socketio(server, {
        cors: {origin: "*"}
    });
    // Game mode
    io.on('connection', async (socket) => {
        // Receive info from the client
        const token = socket.handshake.query.token;
        checkAuthNoDatabase(token).then(() => {
            lobbyManager.connection(io, socket, connection)
        }).catch((err) => {
            socket.emit('status' , "Couldn't authenticate the token.");
            socket.disconnect();
        });
    });

  return io;
};
