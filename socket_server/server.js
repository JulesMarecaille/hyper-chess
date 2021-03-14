const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 5001;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
server.listen(port, ()=> {
    console.log('We are live on ' + port)
});
