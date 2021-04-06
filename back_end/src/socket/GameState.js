const { WHITE, BLACK, swapColor } = require("hyperchess_model/constants");
const { Board, Deck } = require("hyperchess_model");
const TICK = 1000;

class GameState {
    constructor(id, time, increment, game_over_callback){
        this.game_id = id;
        this.players = {};
        this.users_decks = {};
        this.decks = {};
        this.color_to_move = WHITE;
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

        // Elos
        if (this.nb_half_moves >= 2){
            this.winner = winner;
            elo_differences = this.getEloDifferences();
        } else {
            this.winner = null;
            reason = "The game was canceled."
        }
        this.game_over_callback(this.game_id, this.winner, time_remaining, reason, this.players, elo_differences, this.time, this.increment, this.nb_half_moves);
    }

    resign(resign_color){
        this.gameOver(swapColor(resign_color), "By resignation.")
    }

    playMove(move, emit_move_callback){
        if(this.board_object.isMoveLegal(move)){
            this.nb_half_moves = this.nb_half_moves + 1;
            if (this.nb_half_moves >= 2){
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
        this.clocks[WHITE] = new Clock(this.time, this.increment, this.gameOver.bind(this), BLACK);
        this.clocks[BLACK] = new Clock(this.time, this.increment, this.gameOver.bind(this), WHITE);
        let time_remaining = {};
        time_remaining[WHITE] = this.time;
        time_remaining[BLACK] = this.time;
        this.board_object = new Board(Deck.buildFromPayload(this.decks[WHITE]), Deck.buildFromPayload(this.decks[BLACK]));
        return { players: this.players, decks: this.decks, time_remaining: time_remaining};
    }

    isJoinable(){
        return this.is_joinable
    }

    playerLeft(socket_id){
        // Find out which player left
        let player_leaving = WHITE
        if(this.players[BLACK] && this.players[BLACK].socket_id === socket_id){
            let player_leaving = BLACK
        }
        if(this.is_playing){
            this.gameOver(swapColor(player_leaving), "Your opponent left.")
        }
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

        // Start game
        return this.startGame();
    }
}

function getRandomColor() {
  let number = Math.floor(Math.random() * Math.floor(2));
  return [WHITE, BLACK][number]
}

class Clock{
    constructor(time, increment, timeout_callback, swap_color){
        this.time = time;
        this.increment = increment;
        this.timeout_callback = timeout_callback;
        this.interval_obj = null;
        this.swap_color = swap_color;
    }

    start(){
        //Every TICK
        this.interval_obj = setInterval(() => {
            this.time = this.time - TICK;
            if (this.time <= 0){
                clearInterval(this.interval_obj);
                this.time = 0;
                this.timeout_callback(this.swap_color, "By timeout.");
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
