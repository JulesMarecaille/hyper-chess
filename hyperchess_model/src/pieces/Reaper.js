import Piece from './Piece.js'
import {ALLOWED} from '../constants'

class Reaper extends Piece{
	constructor(color){
		let behavior = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 0, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
			16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];
		let description = "The Reaper can go anywhere to move or kill except for the enemy last lane. It cannot take or check the king";
		super(color, behavior, 'Reaper', 'The Reaper', 15, description, ALLOWED.QUEEN, 6000, 0);
	}

    isSpecialPossible(board, target_pos, pos){
        let board_width = Math.sqrt(board.length / 2);
        if ((board[target_pos] && (board[target_pos].is_king || !board[target_pos].can_be_eaten))
            || (board[pos].color === 0 && Math.floor(target_pos / (board_width * 2)) === 0)
            || (board[pos].color === 1 && Math.floor(target_pos / (board_width * 2)) === board_width - 1))//specific to the color ? yess
        {
            return false;
        }
        return true;
    }

    getLegalCheckSquares(board, square, last_move, is_rock_check = true){
        return [];
    }
}

export default Reaper;
