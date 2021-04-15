const { WHITE, BLACK, swapColor } = require("hyperchess_model/constants");
const { Board, Deck } = require("hyperchess_model");
const logger = require("../logging/logger")
const TICK = 1000;

class GameState {
    constructor(id, time, increment, game_over_callback){
        this.game_id = id;
        this.players = {};
        this.users_decks = {};
        this.decks = {};
        this.clocks = {};
        this.winner = null;
        this.is_joinable = true;
        this.is_playing = false;
        this.is_game_over = false;
        this.nb_half_moves = 0;
        this.time = time;
        this.increment = increment;
        this.game_over_callback = game_over_callback;
        this.draw_offers = {};
        this.draw_offers[WHITE] = false;
        this.draw_offers[BLACK] = false;
        this.board_object = null;
        this.disconnection_clock = null;
        this.starting_game_clock = null;
    }

    addPlayer(user, user_decks){
        // if there's already a player in the game
        if(this.players[WHITE] || this.players[BLACK]){
            // pick the color left
            if(this.players[WHITE]){
                this.players[BLACK] = user;
                this.decks[BLACK] = user_decks[BLACK];
                this.users_decks[BLACK] = user_decks;
            } else {
                this.players[WHITE] = user;
                this.decks[WHITE] = user_decks[WHITE];
                this.users_decks[WHITE] = user_decks;
            }
            this.is_joinable = false;
        } else {
            // pick a random color
            let random_color = getRandomColor()
            this.players[random_color] = user;
            this.decks[random_color] = user_decks[random_color];
            this.users_decks[random_color] = user_decks;
            this.creator = user;

            logger.info("Player " + user.name + " created a game offer.")
        }
    }

    gameOver(winner, reason){
        this.is_playing = false;
        this.is_game_over = true;
        let elo_differences = null;

        // Time
        this.clocks[WHITE].pause();
        this.clocks[BLACK].pause();
        let time_remaining = {};
        time_remaining[WHITE] = this.clocks[WHITE].getTimeRemaining();
        time_remaining[BLACK] = this.clocks[BLACK].getTimeRemaining();
        if(this.disconnection_clock){
            this.disconnection_clock.pause();
            this.disconnection_clock = null;
        }
        if(this.starting_game_clock){
            this.starting_game_clock.pause();
            this.starting_game_clock = null;
        }

        // Elos
        if (this.nb_half_moves >= 2){
            this.winner = winner;
            elo_differences = this.getEloDifferences();
        } else {
            this.winner = null;
            reason = "The game was canceled."
        }
        logger.info("Game over between "+ this.players[WHITE].name + " and " + this.players[BLACK].name + " (" + reason + ")")
        this.game_over_callback(
            this.game_id,
            this.winner,
            time_remaining,
            reason,
            this.players,
            elo_differences,
            this.time,
            this.increment,
            this.nb_half_moves,
            this.board_object.getEvents()
        );
    }

    resign(socket_id){
        let resign_color = this.getColorFromSocket(socket_id)
        this.gameOver(swapColor(resign_color), "By resignation.")
    }

    playMove(move, emit_move_callback){
        if(this.board_object.isMoveLegal(move)){
            this.nb_half_moves = this.nb_half_moves + 1;
            if (this.nb_half_moves >= 2){
                if (this.starting_game_clock){
                    this.starting_game_clock.pause();
                    this.starting_game_clock = null;
                }
                this.clocks[swapColor(this.board_object.color_to_move)].pause()
                this.clocks[this.board_object.color_to_move].start()
            }
            let res = {}
            res[WHITE] = this.clocks[WHITE].getTimeRemaining();
            res[BLACK] = this.clocks[BLACK].getTimeRemaining();
            this.draw_offers[WHITE] = false;
            this.draw_offers[BLACK] = false;
            emit_move_callback(res);
            let result = this.board_object.makeMove(move)
            this.is_game_over = result.game_over;
            this.winner = result.winner;
            if(this.is_game_over){
                if(this.winner !== null){
                    this.gameOver(this.winner, "By checkmate.")
                } else {
                    this.gameOver(this.winner, "By repetition.")
                }
            }
        }
    }

    startGame(){
        this.is_playing = true;
        this.clocks[WHITE] = new Clock(this.time, this.increment, this.gameOver.bind(this), BLACK, "By timeout.");
        this.clocks[BLACK] = new Clock(this.time, this.increment, this.gameOver.bind(this), WHITE, "By timeout.");
        let time_remaining = {};
        time_remaining[WHITE] = this.time;
        time_remaining[BLACK] = this.time;
        this.board_object = new Board(Deck.buildFromPayload(this.decks[WHITE]), Deck.buildFromPayload(this.decks[BLACK]));
        this.starting_game_clock = new Clock(60000, 0, this.gameOver.bind(this), null, "");
        this.starting_game_clock.start();
        logger.info("Starting game between "+ this.players[WHITE].name + " and " + this.players[BLACK].name)
        return { players: this.players, decks: this.decks, time_remaining: time_remaining};
    }

    isJoinable(){
        return this.is_joinable
    }

    canUserReconnect(user_id){
        if(this.disconnection_clock && (this.players[BLACK].id == user_id || this.players[WHITE].id == user_id)){
            return true;
        }
        return false;
    }

    getColorFromSocket(socket_id){
        // Find out which player left
        let color = WHITE
        if(this.players[BLACK] && this.players[BLACK].socket_id === socket_id){
            color = BLACK
        }
        return color
    }

    getColorFromUserId(user_id){
        // Find out which player left
        let color = WHITE
        if(this.players[BLACK] && this.players[BLACK].id === user_id){
            color = BLACK
        }
        return color
    }

    playerLeft(socket_id){
        let player_leaving = this.getColorFromSocket(socket_id)
        if(this.is_playing && !this.disconnection_clock){
            if(this.nb_half_moves < 2){
                this.gameOver()
            } else {
                this.disconnection_clock = new Clock(30000, 0, this.gameOver.bind(this), swapColor(player_leaving), "By disconnection.");
                this.disconnection_clock.start();
                return false;
            }
        }
        return true
    }

    playerReconnecting(user_id, socket_id){
        this.disconnection_clock.pause();
        this.disconnection_clock = null;
        this.players[this.getColorFromUserId(user_id)].socket_id = socket_id
        let time_remaining = {};
        time_remaining[WHITE] = this.clocks[WHITE].getTimeRemaining();
        time_remaining[BLACK] = this.clocks[BLACK].getTimeRemaining();
        let payload = {
            game_id: this.game_id,
            players: this.players,
            decks: this.decks,
            time_remaining: time_remaining,
            color_to_move: this.board_object.color_to_move,
            nb_half_moves: this.nb_half_moves,
            history: this.board_object.history
        }
        return payload;
    }

    getEloDifferences(){
        let sb, sw = 0.5
        if(this.winner === WHITE){
            sw = 1;
            sb = 0;
        } else if(this.winner === BLACK){
            sw = 0;
            sb = 1;
        }
        let rw = Math.pow(10, this.players[WHITE].elo/400);
        let rb = Math.pow(10, this.players[BLACK].elo/400);
        let ew = rw / (rw + rb);
        let eb = rb / (rb + rw);
        let elo_differences = {};
        // We use K=18, +9 for a win against a similar opponent
        elo_differences[WHITE] = Math.round(18 * (sw - ew));
        elo_differences[BLACK] = Math.round(18 * (sb - eb));
        return elo_differences;
    }

    offerDraw(color){
        this.draw_offers[color] = true;
    }

    acceptDraw(color){
        this.draw_offers[color] = true;
        if(this.draw_offers[WHITE] && this.draw_offers[BLACK]){
            this.gameOver(null, "By mutual agreement.")
        }
    }

    playersAreDifferent(){
        return this.players[WHITE] && this.players[BLACK] && this.players[WHITE].id !== this.players[BLACK].id;
    }

    rematch(){
        // Swap colors
        [this.players[WHITE], this.players[BLACK]] = [this.players[BLACK], this.players[WHITE]];
        [this.users_decks[WHITE], this.users_decks[BLACK]] = [this.users_decks[BLACK], this.users_decks[WHITE]];
        this.decks[WHITE] = this.users_decks[WHITE][WHITE];
        this.decks[BLACK] = this.users_decks[BLACK][BLACK];

        // Reset Variables
        this.clocks = {};
        this.draw_offers = {};
        this.draw_offers[WHITE] = false;
        this.draw_offers[BLACK] = false;
        this.color_to_move = WHITE;
        this.winner = null;
        this.is_joinable = false;
        this.is_playing = false;
        this.is_game_over = false;
        this.nb_half_moves = 0;
        this.board_object = null;
        this.disconnection_clock = null;
        this.starting_game_clock = null;

        // Start game
        return this.startGame();
    }
}

function getRandomColor() {
  let number = Math.floor(Math.random() * Math.floor(2));
  return [WHITE, BLACK][number]
}

class Clock{
    constructor(time, increment, timeout_callback, swap_color, timeout_reason){
        this.time = time;
        this.increment = increment;
        this.timeout_callback = timeout_callback;
        this.interval_obj = null;
        this.swap_color = swap_color;
        this.timeout_reason = timeout_reason;
    }

    start(){
        //Every TICK
        this.interval_obj = setInterval(() => {
            this.time = this.time - TICK;
            if (this.time <= 0){
                clearInterval(this.interval_obj);
                this.time = 0;
                this.timeout_callback(this.swap_color, this.timeout_reason);
            }
        }, TICK);
    }

    pause(){
        if(this.interval_obj){
            clearInterval(this.interval_obj);
            this.time = this.time + this.increment;
        }
    }

    getTimeRemaining(){
        return this.time
    }
}

module.exports = GameState
