const GameState = require("./GameState")
var sockets_in_session = {};
var games_state = {};
var gameSocket;
var io;

function connection(sio, socket) {
    try {
        io = sio;
        game_socket = socket;
        sockets_in_session[socket.id] = game_socket;
        game_socket.on("disconnect", onDisconnect);
        game_socket.on("disconnecting", onDisconnecting);
        game_socket.on("leaveGame", onLeaveGame);
        game_socket.on("createNewGame", onCreateNewGame);
        game_socket.on("playerJoinedGame", onPlayerJoinedGame);
        game_socket.on("makeMove", onMakeMove);
    } catch (e) {
        console.log(e)
    }
}

function onDisconnect() {
    delete sockets_in_session[this.id];
}

function onDisconnecting() {
    for(room of this.rooms){
        this.to(room.id).emit('opponentLeft', this.id);
    }
}

function onMakeMove(move) {
    const game_id = move.game_id
    if(move.player_color === games_state[game_id].color_to_move){
        this.to(game_id).emit('opponentMove', move);
        games_state[game_id].shiftTurn();
    }
}

function onCreateNewGame(data) {
    this.emit('newGameCreated', {my_socket_id: this.id});
    games_state[data.game_id] = new GameState(data.game_id)
    games_state[data.game_id].addPlayer(data.user)
    this.join(data.game_id)
}

function onLeaveGame(game_id){
    this.to(game_id).emit('opponentLeft', this.id);
    this.leave(game_id)
}

function onPlayerJoinedGame(data) {
    // Look up the room ID in the Socket.IO manager object.
    let game_id = data.game_id
    let room = io.sockets.adapter.rooms.get(game_id)
    if (room === undefined) {
        this.emit('joinError' , "This game does not exist anymore." );
        return
    }

    // Check number of players in the room
    if (room.size < 2) {
        data.my_socket_id = this.id;

        this.join(game_id);
        games_state[game_id].addPlayer(data.user);
        if (room.size === 2) {
            io.sockets.in(game_id).emit('startGame', games_state[game_id].startGame())
        }
    } else if (room.size >= 2) {
        this.emit('joinError' , "There are already 2 people playing in this room.");
    }
}

exports.connection = connection;
