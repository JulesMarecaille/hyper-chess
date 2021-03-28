import { v4 as uuidv4 } from 'uuid';
import { createClassicDeck } from './utils.js';
import { K } from './constants.js';

class User {
    constructor(name, id=null, elo=1000, decks=[]) {
        if(!id){
            this.id = uuidv4();
        } else {
            this.id = id
        }
        this.white_select = 0;
        this.black_select = 0;
        this.name = name;
        this.elo = elo;
        if (decks){
            this.decks = decks;
        } else {
            this.decks = [createClassicDeck()];
        }
    }

    updateElo(result, opponent_elo){
        let chance_to_win = 1 / (1 + 10^((opponent_elo - this.elo)/400));
        chance_to_win = Math.round(chance_to_win * 100) / 100;
        this.elo = this.elo + Math.round(K * (result - chance_to_win));
    }
}

export default User
