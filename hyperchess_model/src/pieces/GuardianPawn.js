import Piece from './Piece.js'
import {ALLOWED, WHITE, BLACK} from '../constants'
import { cloneDeep } from "lodash"
import { squaresPassed } from '../utils.js'

class ClassicPawn extends Piece{
	constructor(color, behavior = null)
	{
		let description = "Similar to the classic pawn from the classic game of chess, but it can't promote nor do a two square advance. It can teleport to a square adjacent to the king.";
		if (!behavior){
			behavior = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 18, 17, 18, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 0, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];
		}
		super(color, behavior, 'GuardianPawn', 'Guardian Pawn', 1, description, ALLOWED.PAWN, 750);
		this.is_pawn = true;
	}

	move(move, board, last_move){
		if (this.checkPassant(board, move.to, move.from, last_move)){
			board[last_move.to] = null;
		}
		return super.move(move, board, last_move);
	}

    isSpecialPossible(board, target_square, pos){
        let total_board_width = Math.sqrt(board.length / 2) * 2;
        if (!this.isEmpty(board, target_square)){ return false }
        let around_squares = [ target_square + 1,
                            target_square - 1,
                            target_square + total_board_width + 1,
                            target_square + total_board_width - 1,
                            target_square + total_board_width,
                            target_square - total_board_width + 1,
                            target_square - total_board_width - 1,
                            target_square - total_board_width];
        for (let a_square_around of around_squares){
            if (a_square_around >= 0
                && a_square_around < board.length - (total_board_width / 2)
                && a_square_around % total_board_width < total_board_width / 2
                && board[a_square_around]
                && this.isAlly(board, a_square_around)
                && board[a_square_around].is_king)
            {
                return true;
            }
        }
        return false;
    }

	checkPassant(board, target_square, pos, last_move){
		if (board[pos]
			&& board[pos].is_pawn
			&& last_move
			&& board[last_move.to]
			&& board[last_move.to].is_pawn
			&& board[pos].color !== board[last_move.to].color){
				let listes = squaresPassed(last_move);
				if (listes && listes.includes(target_square)){
					return true;
				}
		}
		return false;
	}
}

export default ClassicPawn;
