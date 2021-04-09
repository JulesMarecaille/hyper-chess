const GameState = require("./GameState")
var sockets_in_session = {};
var games_state = {};
var gameSocket;
var io;
var sequelize;
const { WHITE, BLACK, MAX_DAILY_GAME_COINS, COINS_PER_WIN } = require("hyperchess_model/constants")
const logger = require("../logging/logger")

function connection(sio, socket, sequelize_connection, user_id) {
    try {
        io = sio;
        sequelize = sequelize_connection;
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
        game_socket.on("proposeDraw", onProposeDraw);
        game_socket.on("acceptDraw", onAcceptDraw);
        game_socket.on("offerRematch", onOfferRematch);
        game_socket.on("acceptRematch", onAcceptRematch);
        game_socket.on("declineRematch", onDeclineRematch);
        game_socket.on("tryToReconnect", onTryToReconnect);
    } catch (e) {
        logger
    }
}

function onDisconnect() {
    try{
        delete sockets_in_session[this.id];
    } catch (e) {
        logger.error("onDisconnect failed :" + e)
    }
}

function onDisconnecting() {
    try{
        for(room of Array.from(this.rooms)){
            let game_id = room;
            leaveGame(game_id, this)
        }
    } catch (e){
        logger.error("onDisconnecting failed :" + e)
    }
}

function onRequestGameOffers(user_id){
    try{
        let gameoffers = []
        for([game_id, game_state] of Object.entries(games_state)){
            let game_state = games_state[game_id]
            if(game_state.isJoinable() && game_state.creator.id !== user_id){
                gameoffers.push({
                    id: game_state.game_id,
                    user: game_state.creator,
                    time: game_state.time,
                    increment: game_state.increment
                })
            }
        }
        this.emit("receiveGameOffers", gameoffers)
    } catch (e){
        logger.error("onRequestGameOffers failed :" + e)
    }
}

function onMakeMove(data) {
    try{
        const game_id = data.game_id
        if(!games_state[game_id].is_game_over){
            games_state[game_id].playMove(data.move, (time_remaining) => {
                let payload = {move: data.move, time_remaining: time_remaining};
                this.to(game_id).emit('opponentMove', payload);
            });
        }
    } catch (e){
        logger.error("onMakeMove failed :" + e)
    }
}

function onCreateNewGame(data) {
    try {
        this.emit('newGameCreated');
        data.user.socket_id = this.id;
        games_state[data.game_id] = new GameState(data.game_id, data.time, data.increment, gameOver)
        games_state[data.game_id].addPlayer(data.user, data.user_decks)
        this.join(data.game_id)
    } catch (e){
        logger.error("onMakeMove failed :" + e)
    }
}

function onLeaveGame(game_id){
    try{
        leaveGame(game_id, this);
    } catch (e){
        logger.error("onLeaveGame failed :" + e)
    }
}

function onResign(data){
    try {
        games_state[data.game_id].resign(this.id);
    } catch (e){
        logger.error("onResign failed :" + e)
    }
}

function onPlayerJoinedGame(data) {
    try{
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
            games_state[game_id].addPlayer(data.user, data.user_decks);
            if (room.size === 2 && games_state[game_id].playersAreDifferent()) {
                io.sockets.in(game_id).emit('startGame', games_state[game_id].startGame())
            }
        } else if (room.size >= 2) {
            this.emit('joinError' , "This game does not exist anymore.");
        }
    } catch (e){
        logger.error("onPlayerJoinedGame failed :" + e)
    }
}

function onProposeDraw(data){
    try{
        this.to(data.game_id).emit('opponentOfferDraw')
        games_state[data.game_id].offerDraw(data.color);
    } catch (e){
        logger.error("onPlayerJoinedGame failed :" + e)
    }
}

function onAcceptDraw(data){
    try{
        games_state[data.game_id].acceptDraw(data.color);
    } catch (e){
        logger.error("onAcceptDraw failed :" + e)
    }
}

function onOfferRematch(data){
    try{
        if(games_state[data.game_id]){
            games_state[data.game_id]
            this.to(data.game_id).emit('opponentOfferRematch');
        } else {
            this.emit('opponentDeclineRematch');
            leaveGame(data.game_id, this)
        }
    } catch (e){
        logger.error("onOfferRematch failed :" + e)
    }
}

function onAcceptRematch(data){
    try{
        if(games_state[data.game_id]){
            io.sockets.in(data.game_id).emit('startGame', games_state[data.game_id].rematch())
        } else {
            leaveGame(data.game_id, this)
        }
    } catch (e){
        logger.error("onAcceptRematch failed :" + e)
    }
}

function onDeclineRematch(data){
    try{
        this.to(data.game_id).emit('opponentDeclineRematch')
        leaveGame(data.game_id, this)
    } catch (e){
        logger.error("onDeclineRematch failed :" + e)
    }
}

function onTryToReconnect(data){
    try{
        for(let [game_id, game_state] of Object.entries(games_state)){
            if(game_state.canUserReconnect(data.user_id)){
                this.emit('reconnectToGame', game_state.playerReconnecting(data.user_id, this.id));
                this.to(game_id).emit("opponentReconnected", {})
                this.join(game_state.game_id)
                break;
            }
        }
    } catch (e){
        logger.error("onTryToReconnect failed :" + e)
    }
}

// Utils
async function gameOver(game_id, winner, time_remaining, reason, players, elo_differences, time, increment, nb_half_moves){
    try{
        const { Rewards } = require("../entities")(sequelize)
        // Give money to the winner if there's a winner and if the game wasn't canceled
        let coins_won = {};
        coins_won[WHITE] = 0;
        coins_won[BLACK] = 0;
        if((winner === WHITE || winner === BLACK) && elo_differences){
            rewards = await Rewards.findOne({where: {UserId: players[winner].id}})
            if(rewards.last_game_coins_collected < new Date().setHours(0, 0, 0, 0)){
                rewards.todays_coins_collected = 0;
            }
            if(rewards.todays_coins_collected < MAX_DAILY_GAME_COINS){
                rewards.todays_coins_collected += COINS_PER_WIN
                rewards.last_game_coins_collected = new Date();
                coins_won[winner] = COINS_PER_WIN;
            }
            rewards.save();
        }

        // Tell the clients that the game ended
        let payload = {
            winner: winner,
            time_remaining: time_remaining,
            reason: reason,
            elo_differences: elo_differences,
            coins_won: coins_won
        };
        io.sockets.in(game_id).emit('gameOver', payload);

        // If game wasn't canceled, handle game results and user changes
        if(elo_differences){
            gameResults(players, elo_differences, winner, time, increment, nb_half_moves, coins_won);
        } else {
            delete games_state[game_id];
        }
    } catch (e){
        logger.error("gameOver failed :" + e)
    }
}

function leaveGame(game_id, socket){
    if(games_state[game_id]){
        let to_delete = games_state[game_id].playerLeft(socket.id)
        if(to_delete){
            games_state[game_id] = null;
            delete games_state[game_id];
        } else {
            socket.to(game_id).emit("opponentDisconnected", {})
        }
    }
    socket.leave(game_id)
}

function gameResults(players, elo_differences, winner, time, increment, nb_half_moves, coins_won){
    const { User, GameResult } = require("../entities")(sequelize)

    // Store game gameResults
    let white_won = (winner === WHITE);
    let draw = (winner == null);
    let white_id = players[WHITE].id;
    let black_id = players[BLACK].id;
    let white_name = players[WHITE].name;
    let black_name = players[BLACK].name;
    let white_elo = players[WHITE].elo;
    let black_elo = players[BLACK].elo;

    GameResult.create({
        whiteId: white_id,
        blackId: black_id,
        white_elo: white_elo,
        black_elo: black_elo,
        white_name: white_name,
        black_name: black_name,
        draw: draw,
        white_won: white_won,
        time: time,
        time_increment: increment,
        number_of_half_moves: nb_half_moves
    })

    // Update Elos
    for(const [color, player] of Object.entries(players)){
        User.findOne({where: {id: player.id}}).then((user) => {
            user.elo += elo_differences[color];
            user.coins += coins_won[color];
            user.save()
        })
    }
}

exports.connection = connection;
