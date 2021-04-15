import Piece from './Piece.js'
import {ALLOWED} from '../constants'
import { squaresPassed } from '../utils.js'

class Elephant extends Piece{
	constructor(color){
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 15, 1, 1, 0, 1, 1, 15, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "It can go up to 3 squares, the last one is a charge. It can only take a piece when he charges, and destroys everything on its way";
		super(color, behavior, 'Elephant', 'Elephant', 5, description, ALLOWED.ROOK, 1000);
	}

    move(move, board, last_move, game_events){
		this.moved = true;
		let nb_captures = !this.isEmpty(board, move.to) ? 1 : 0
		if (board[move.to]){
			board = board[move.to].deleteElementFromMove(move, board);
			if (board[move.to]){//si la pièce est toujours la
				board = board[move.to].deleteElementFromSquare(move.to, board);
			}
		}
        squaresPassed(move).forEach((square, i) => {
            if (board[square] && board[square].can_be_eaten){
                board[square] = null;
				nb_captures += 1;
            }
        });
		board[move.to] = board[move.from];
		board[move.from] = null;
        return this.getMoveResult(board, nb_captures, game_events);
    }
}

export default Elephant;
