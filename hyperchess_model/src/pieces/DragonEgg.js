import Piece from './Piece.js'
import {ALLOWED} from '../constants'

class DragonEgg extends Piece {
    constructor(color){
        let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "A dragon egg that may hatch into a Dragon if surrounded by allys.";
		super(color, behavior, 'DragonEgg', 'The egg of a dragon', 5, description, ALLOWED.ROOK, 1500);
    }

    squareIsNotAdjacent(square, target_square, board_width){
        let distance = Math.abs(target_square % board_width - square % board_width);
        return distance > 1;
    }

    isSurroundedByAllys(board, square){
        let board_width = Math.sqrt(board.length);
        let around_pos = [ square + 1,
                            square - 1,
                            square + board_width + 1,
                            square + board_width - 1,
                            square + board_width,
                            square - board_width + 1,
                            square - board_width - 1,
                            square - board_width];
        for (let target_square of around_pos){
            if (square < 0
                || square >= board.length
                || this.squareIsNotAdjacent(square, target_square, board_width)
                || !board[target_square]
                || !board[target].isAlly(board, target_pos))
            {
                return false;
            }
        }
        return true;
    }

    updateStatusFromBoard(board, square){
        if (this.isSurroundedByAllys(board, square)){
            board[square] = new Dragon(board[square].color);
        }
        return board;
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
			0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
			16, 16, 16, 16, 16, 16, 1, 0, 1, 16, 16, 16, 16, 16, 16, 16,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0];
		let description = "A dragon egg that may hatch into a Dragon if surrounded by allys.";
		super(color, behavior, 'DragonEgg', 'The egg of a dragon', 5, description, ALLOWED.ROOK, 1500);
    }

    isSpecialPossible(board, target_pos, pos){
        let board_width = Math.sqrt(board.length);
        if (Math.floor(target_pos / board_width) === Math.floor(pos / board_width)
            && (target_pos % board_width === 0 || target_pos % board_width === board_width - 1))
        {
            return true;
        }
        if (target_pos % board_width === pos % board_width
            && (Math.floor(target_pos / board_width) === 0 || Math.floor(target_pos / board_width) === board_width - 1))
        {
            return true;
        }
        return false;
    }

    move(move, board, last_move){
        squaresPassed(move).forEach((square, i) => {
            if (board[square] && board[square].can_be_eaten){
                board = board[square].deleteElementFromSquare(square, board);
            }
        });
        board = super.move(move, board, last_move);
        board[move.from] = board[move.to];
        board[move.to] = null;
        return board;
    }
}

export default DragonEgg;
