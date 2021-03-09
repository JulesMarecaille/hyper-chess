import Deck from './Deck'
import Player from './Player'

export function createClassicDeck(){
    let pieces = ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicRook', 'ClassicKnight', 'ClassicBishop', 'ClassicQueen',
                  'ClassicKing', 'ClassicBishop', 'ClassicKnight', 'ClassicRook']
    return new Deck(null, 'Classic Deck', pieces, null);
}

export function createPlayer(name){
    return new Player(name);
}
