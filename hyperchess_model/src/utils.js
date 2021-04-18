import {ALLOWED_POS, ALLOWED } from './constants'

export function distanceFromMove(move, board){
	let board_width = Math.sqrt(board.length / 2);
	let distance_x = Math.abs(Math.floor(move.to / (board_width * 2)) - Math.floor(move.from / (board_width * 2)));
	let distance_y = Math.abs(move.to % (board_width * 2) - move.from % (board_width * 2));
	return distance_x > distance_y ? distance_x : distance_y;
}

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
