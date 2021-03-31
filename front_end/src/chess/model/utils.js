import Deck from './Deck'
import User from './User'
import {ALLOWED_POS, ALLOWED } from './constants'

export function squaresPassed(move){
	let list = [];
	let min = Math.min(move.to, move.from);
	let max = Math.max(move.to, move.from);
	let increment = max - min > 7 ? 16 : 1;//line or column
	if (min % 8 === max % 8 || max - min < 8){
		while (min < max) {
			min += increment;
			if (min !== max){
				list.push(min);
			}
		}
	}
	return list;
}


export function getAllowedPosition(piece_allowed)
{
    let allowed_pos = [];
    for(const [mask, allowed_pos_of_mask] of Object.entries(ALLOWED_POS)){
        if (mask & piece_allowed){
            allowed_pos = allowed_pos.concat(allowed_pos_of_mask);
        }
    }
    return (allowed_pos);
}

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

export function createClassicKnightDeck(){
    let pieces = ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicRook', 'ClassicKnight', 'ClassicKnight', 'ClassicQueen',
                  'ClassicKing', 'ClassicKnight', 'ClassicKnight', 'ClassicRook']
    return new Deck(null, 'Classic Knight Deck', pieces, null);
}

export function createClassicQueenDeck(){
    let pieces = ['ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicPawn', 'ClassicPawn', 'ClassicPawn', 'ClassicPawn',
                  'ClassicQueen', 'ClassicPawn', 'ClassicPawn', 'ClassicQueen',
                  'ClassicKing', 'ClassicPawn', 'ClassicPawn', 'ClassicQueen']
    return new Deck(null, 'Classic Queen Deck', pieces, null);
}
