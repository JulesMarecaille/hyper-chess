import Piece from './Piece.js'
import {ALLOWED} from '../constants'
import { squaresPassed, distanceFromMove } from '../utils.js'

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

	getLegalCheckSquares(board, square, last_move, is_rock_check = true){
		let legal_squares = this.getLegalSquares(board, square, last_move, is_rock_check = true);
        let check_squares = [];
		legal_squares.forEach((target_square, i) => {
			let move = {
				to: target_square,
                from: square,
			};
			if (distanceFromMove(move, board) === 3){
            	let squares_passed = squaresPassed(move);
            	check_squares = check_squares.concat(squares_passed);
			}
		});
		legal_squares = legal_squares.concat(check_squares);
		return legal_squares;
	}

    move(move, board, last_move, game_events){
		let nb_captures = !this.isEmpty(board, move.to) ? 1 : 0;
		if (board[move.to]){
			board = board[move.to].deleteElementFromMove(move, board);
		}
        squaresPassed(move).forEach((square, i) => {
            if (board[square] && board[square].can_be_eaten){
                board = board[square].deleteElementFromSquare(square, board);
				nb_captures += 1;
            }
        });
		board[move.to] = board[move.from];
		board[move.from] = null;
        return this.getMoveResult(board, nb_captures, game_events);
    }
}

export default Elephant;
