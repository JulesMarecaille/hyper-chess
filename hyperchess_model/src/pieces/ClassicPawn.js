import Piece from './Piece.js'
import {ALLOWED, WHITE, BLACK} from '../constants'
import { cloneDeep } from "lodash"
import { squaresPassed } from '../utils.js'

class ClassicPawn extends Piece{
	constructor(color){
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 6, 5, 6, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "The classic pawn from the classic game of chess.";
		super(color, behavior, 'ClassicPawn', 'Classic Pawn', 1, description, ALLOWED.PAWN, 0);
		this.is_pawn = true;
		this.set_name = "Classic"
	}

	getAction(move){
		let options_promote = ["ClassicQueen", "ClassicRook", "ClassicBishop", "ClassicKnight"];
		if ((move.to <= 8 && this.color == WHITE)
			|| (move.to >= 8 * 2 * 7 && this.color == BLACK))
		{
			return options_promote;
		}
	}

	makeAction(move, selection){
		let new_move = cloneDeep(move);
		new_move.action = {into:selection};
		return new_move;
	}

	move(move, board, last_move){
		this.behavior[87] = 0;
		this.behavior[151] = 0;
		if (this.checkPassant(board, move.to, move.from, last_move)){
			board[last_move.to] = null;
		}
		return super.move(move, board, last_move);
	}

	checkPassant(board, target_pos, pos, last_move){
		if (board[pos]
			&& board[pos].is_pawn
			&& last_move
			&& board[last_move.to]
			&& board[last_move.to].is_pawn
			&& board[pos].color !== board[last_move.to].color){
				let listes = squaresPassed(last_move);
				if (listes && listes.includes(target_pos)){
					return true;
				}
		}
		return false;
	}
}

export default ClassicPawn;
