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
        return board;
    }
}

export default DeadlyMark;
