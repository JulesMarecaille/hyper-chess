import Piece from './Piece.js'
import {ALLOWED} from '../constants'

function canNotBeCrossedForCastle(board, square, color, last_move){
	let index = 0;
	let list = [];

	while (index < 128){
		if (board[index] && board[index].color !== color && board[index]){
			list = board[index].getLegalSquares(board, index, last_move, 0);
			if (list.includes(square))
				return (true);
		}
		index++;
	}
	if (board[square] && board[square].is_mark){
		return true;
	}
	return false;
}

class ClassicKing extends Piece{
	constructor(color){
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 16, 3, 0, 3, 16, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "The classic king from the classic game of chess.";
		super(color, behavior, 'ClassicKing', 'Classic King', 1, description, ALLOWED.KING, 0);
		this.is_king = true;
		this.set_name = "Classic"
	}

	CanCastel(board, target_pos, pos, index, last_move){
		let target = this.behavior[index];
		if (target & (1 << 4) && !this.moved){
			let mate;
			if (target_pos < pos){
				mate = board[target_pos - 2];
				for (let k = 1; k <  4; k++){
					if (canNotBeCrossedForCastle(board, pos - k, this.color, last_move)
						|| !this.isEmpty(board, pos - k))
					{
						return false;
					}
				}
			} else {
				mate = board[target_pos + 1];
				for (let k = 1; k <  3; k++){
					if (canNotBeCrossedForCastle(board, pos + k, this.color, last_move)
						|| !this.isEmpty(board, pos + k))
					{
						return false;
					}
				}
			}
			if (!mate)
				return false;
			if (mate.moved || !mate.can_castel)
				return false;
			if (canNotBeCrossedForCastle(board, pos))
				return false;
			return (true);
		}
		return (false);
	}

	move(move_struct, board, last_move, game_events){
		let move_result = super.move(move_struct, board, last_move, game_events);
		board = move_result.board;
		if (Math.abs(move_struct.to - move_struct.from) === 2){
			if (move_struct.to > move_struct.from){
				board[move_struct.to - 1] = board[move_struct.to + 1];
				board[move_struct.to + 1] = null;
			} else if (move_struct.to < move_struct.from) {
				board[move_struct.to + 1] = board[move_struct.to - 2];
				board[move_struct.to - 2] = null;
			}
		}
		return this.getMoveResult(board, move_result.nb_captures, move_result.game_events);
	}

}

export default ClassicKing;
