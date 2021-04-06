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
