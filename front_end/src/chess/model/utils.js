import Deck from './Deck'
import User from './User'

export function createClassicDeck(){
    let pieces = ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicRook', 'ClassicKnight', 'ClassicBishop', 'ClassicQueen',
                  'ClassicKing', 'ClassicBishop', 'ClassicKnight', 'ClassicRook']
    return new Deck(null, 'Classic Deck', pieces, null);
}

export function createUser(name){
    return new User(name);
}
