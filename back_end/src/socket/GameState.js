const WHITE = 0;
const BLACK = 1;
const TICK = 1000;

class GameState {
    constructor(id, time, increment, game_over_callback){
        this.game_id = id;
        this.players = {};
        this.color_to_move = WHITE;
        this.clocks = {};
        this.winner = null;
        this.is_joinable = true;
        this.is_playing = false;
        this.is_game_over = false;
        this.creator = null;
        this.nb_half_moves = 0;
        this.time = time;
        this.increment = increment;
        this.game_over_callback = game_over_callback;
    }

    addPlayer(user){
        // if there's already a player in the game
        if(this.players[WHITE] || this.players[BLACK]){
            // pick the color left
            if(this.players[WHITE]){
                this.players[BLACK] = user;
            } else {
                this.players[WHITE] = user;
            }
            this.is_joinable = false;
        } else {
            // pick a random color
            let random_color = getRandomColor()
            this.players[random_color] = user;
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
        this.game_over_callback(this.game_id, this.winner, time_remaining, reason, this.players, elo_differences);
    }

    resign(resign_color){
        this.gameOver(swapColor(resign_color), "By resignation.")
    }

    shiftTurn(){
        this.color_to_move = swapColor(this.color_to_move);
        this.nb_half_moves = this.nb_half_moves + 1;
        if (this.nb_half_moves >= 2){
            this.clocks[swapColor(this.color_to_move)].pause()
            this.clocks[this.color_to_move].start()
        }
        let res = {}
        res[WHITE] = this.clocks[WHITE].getTimeRemaining();
        res[BLACK] = this.clocks[BLACK].getTimeRemaining();
        return res;
    }

    startGame(){
        this.is_playing = true;
        this.clocks[WHITE] = new Clock(this.time, this.increment, this.gameOver.bind(this), BLACK);
        this.clocks[BLACK] = new Clock(this.time, this.increment, this.gameOver.bind(this), WHITE);
        let time_remaining = {};
        time_remaining[WHITE] = this.time;
        time_remaining[BLACK] = this.time;
        return { players: this.players, time_remaining: time_remaining};
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

    rematch(){

    }
}

function getRandomColor() {
  let number = Math.floor(Math.random() * Math.floor(2));
  return [WHITE, BLACK][number]
}

function swapColor(color){
    if(color === BLACK){
        return WHITE;
    }
    return BLACK;
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
        //Every 2s
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
