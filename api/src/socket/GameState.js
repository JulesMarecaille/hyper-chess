const WHITE = 0;
const BLACK = 1;

class GameState {
    constructor(id, room){
        this.game_id = id;
        this.players = {};
        this.color_to_move = WHITE;
        this.winner = null;
        this.on_going = false;
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
        } else {
            // pick a random color
            let random_color = getRandomColor()
            this.players[random_color] = user;
        }
    }

    shiftTurn(){
        this.color_to_move = swapColor(this.color_to_move);
    }

    startGame(){
        return { players: this.players };
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
