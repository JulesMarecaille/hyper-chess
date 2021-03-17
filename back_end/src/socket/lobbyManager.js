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
        game_socket.on("requestGameOffers", onRequestGameOffers);
        game_socket.on("playerResign", onResign);
    } catch (e) {
        console.log(e)
    }
}

function onDisconnect() {
    delete sockets_in_session[this.id];
}

function onDisconnecting() {
    for(room of Array.from(this.rooms)){
        let game_id = room;
        leaveGame(game_id, this);
    }
}

function onRequestGameOffers(){
    let gameoffers = []
    for([game_id, game_state] of Object.entries(games_state)){
        let game_state = games_state[game_id]
        if(game_state.isJoinable()){
            gameoffers.push({
                id: game_state.game_id,
                user: game_state.creator,
                time: game_state.time,
                increment: game_state.increment
            })
        }
    }
    this.emit("receiveGameOffers", gameoffers)
}

function onMakeMove(data) {
    const game_id = data.game_id
    if(data.move.player_color === games_state[game_id].color_to_move && !games_state[game_id].is_game_over){
        if(data.is_game_over){
            games_state[game_id].gameOver(data.winner, "By checkmate.");
        } else {
            time_remaining = games_state[game_id].shiftTurn();
            let payload = {move: data.move, time_remaining: time_remaining};
            this.to(game_id).emit('opponentMove', payload);
        }
    }
}

function onCreateNewGame(data) {
    this.emit('newGameCreated');
    data.user.socket_id = this.id;
    games_state[data.game_id] = new GameState(data.game_id, data.time, data.increment, gameOver)
    games_state[data.game_id].addPlayer(data.user)
    this.join(data.game_id)
}

function onLeaveGame(game_id){
    leaveGame(game_id, this);
}

function onResign(data){
    games_state[game_id].resign(data.color);
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
        data.user.socket_id = this.id;

        this.join(game_id);
        games_state[game_id].addPlayer(data.user);
        if (room.size === 2) {
            io.sockets.in(game_id).emit('startGame', games_state[game_id].startGame())
        }
    } else if (room.size >= 2) {
        this.emit('joinError' , "This game does not exist anymore.");
    }
}

function gameOver(game_id, winner, time_remaining, reason){
    let payload = {
        winner: winner,
        time_remaining: time_remaining,
        reason: reason
    };
    io.sockets.in(game_id).emit('gameOver', payload);
}

function leaveGame(game_id, socket){
    if(games_state[game_id]){
        games_state[game_id].playerLeft(socket.id)
        delete games_state[game_id];
    }
    socket.leave(game_id)
}

exports.connection = connection;
