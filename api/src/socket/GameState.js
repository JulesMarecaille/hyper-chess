const WHITE = 0;
const BLACK = 1;

class GameState {
    constructor(id, room){
        this.game_id = id;
        this.players = {};
        this.color_to_move = WHITE;
        this.winner = null;
        this.is_joinable = true;
        this.is_playing = false;
        this.creator = null;
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

    gameOver(winner){
        this.is_playing = false;
        this.winner = winner;
    }

    shiftTurn(){
        this.color_to_move = swapColor(this.color_to_move);
    }

    startGame(){
        this.is_playing = true;
        return { players: this.players };
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
            this.is_playing = false
            this.gameOver(swapColor(player_leaving))
        }
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

module.exports = GameState
