import Mark from "./Mark.js"

class DeadlyMark extends Mark{
    constructor(){
        super("DeadlyMark", "Deadly Mark",  "A deadly mark that kill those who step on it");
        this.is_deadly = true;
    }

    deleteElementFromMove(move, board){
        if (board[move.from]){
            board[move.from].deleteElementFromSquare(move.from, board);
        }
        if (board[move.to]){
            board = board[move.to].deleteElementFromSquare(move.to, board);
        }
        return board;
    }

    deleteElementFromSquare(square, board){
        if (this.can_be_eaten){
            board[square] = null;
        }
        if (this.linked_square >= 0 && board[this.linked_square]){
            board[this.linked_square].linked_square = -1;
        }
		return board;
	}
}

export default DeadlyMark;
