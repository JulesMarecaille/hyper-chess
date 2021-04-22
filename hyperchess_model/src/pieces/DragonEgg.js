import Piece from './Piece.js'
import {ALLOWED} from '../constants'
import { squaresPassed, distanceTraveledFromMove } from '../utils.js'

class DragonEgg extends Piece {
    constructor(color){
        let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "A dragon egg that may hatch into a Dragon if surrounded by pieces.";
		super(color, behavior, 'DragonEgg', 'Dragon Egg', 5, description, ALLOWED.ROOK, 1500);
        this.pieces_linked.push(new Dragon(color));
    }

    isSurroundedByPieces(board, square){
        let total_board_width = Math.sqrt(board.length / 2) * 2;
        let around_squares = [ square + 1,
                            square - 1,
                            square + total_board_width + 1,
                            square + total_board_width - 1,
                            square + total_board_width,
                            square - total_board_width + 1,
                            square - total_board_width - 1,
                            square - total_board_width];
        for (let target_square of around_squares){
            if (target_square < 0
                || target_square >= board.length - (total_board_width / 2)
                || target_square % total_board_width > total_board_width / 2
                || !board[target_square]
                || (!board[target_square].isAlly(board, target_square) && !board[target_square].isEnemy(board, target_square)))
            {
                return false;
            }
        }
        return true;
    }

    updateStatusFromBoard(board, square, game_events, nbr_captures){
        if (this.isSurroundedByPieces(board, square)){
            board[square] = this.linked_piece;
        }
        return this.getMoveResult(board, nbr_captures, game_events);
    }
}

class Dragon extends Piece {
    constructor(color){
        let behavior = [0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			16, 16, 16, 16, 16, 16, 1, 0, 1, 16, 16, 16, 16, 16, 16, 16,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0];
		let description = "A dragon that can throw a line of fire on the board at maximum range and destroying everything on its way, without moving.";
		super(color, behavior, 'Dragon', 'Dragon', 0, description, 0, 10000);
    }

    isSpecialPossible(board, target_pos, pos){
        let board_width = Math.sqrt(board.length / 2);
        if (Math.floor(target_pos / (board_width * 2)) === Math.floor(pos / (board_width * 2))
            && (target_pos % board_width === 0 || target_pos % board_width === board_width - 1))
        {
            return true;
        }
        if (target_pos % board_width === pos % board_width
            && (Math.floor(target_pos / (board_width * 2)) === 0 || Math.floor(target_pos / (board_width * 2)) === board_width - 1))
        {
            return true;
        }
        return false;
    }

    getLegalCheckSquares(board, square, last_move, is_rock_check = true){
		let legal_squares = this.getLegalSquares(board, square, last_move, is_rock_check = true);
        let check_squares = [];
        legal_squares.forEach((target_square, i) => {
            let move = {
                to: target_square,
                from: square,
            };
            let squares_passed = squaresPassed(move);
            check_squares = check_squares.concat(squares_passed);
        });
        legal_squares = legal_squares.concat(check_squares);
        return legal_squares;
	}

    move(move, board, last_move, game_events){
        let nb_captures = 0;
        let squares_passed = squaresPassed(move);
        squares_passed.push(move.to);
        squares_passed.forEach((square, i) => {
            if (board[square] && board[square].can_be_eaten){
                board = board[square].deleteElementFromSquare(square, board);
                nb_captures += 1;
            }
        });
        if (distanceTraveledFromMove(move, board) <= 1){
            board[move.to] = board[move.from];
            board[move.from] = null;
        }
        return this.getMoveResult(board, nb_captures, game_events);
    }
}

export default DragonEgg;
