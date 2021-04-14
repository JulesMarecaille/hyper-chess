import {ALLOWED} from '../constants'
import ClassicPawn from './ClassicPawn.js'
import ClassicRook from './ClassicRook.js'
import ClassicKnight from './ClassicKnight.js'
import ClassicBishop from './ClassicBishop.js'
import ClassicQueen from './ClassicQueen.js'
import ClassicKing from './ClassicKing.js'
import Piece from './Piece.js'

class Mark extends Piece{
    constructor(){
        let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        super(0, behavior, "Mark", "Deadly Mark", 0, "A deadly mark that kill those who step on it", 0, 0);
        this.is_mark = true;
        this.piece_pos = -1;
    }

    onStepOn(move, board){
        board[move.from] = null;
        return board;
    }
}

function putMark(move, board, mark_pos, mark){
    if (mark_pos > -1 && board[mark_pos] && board[mark_pos].is_mark){
        board[mark_pos] = null;
    }
    board[move.from] = mark;
    return board;
}

export class PixelPawn extends ClassicPawn{
    constructor(color){
        super(color);
        this.name = "PixelPawn";
        this.cost = 400;
        this.label = "Pixel Pawn";
        this.description = "A classic Pawn that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export class PixelRook extends ClassicRook{
    constructor(color){
        super(color);
        this.name = "PixelRook";
        this.cost = 400;
        this.label = "Pixel Rook";
        this.description = "A classic Rook that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export class PixelKnight extends ClassicKnight{
    constructor(color){
        super(color);
        this.name = "PixelKnight";
        this.cost = 400;
        this.label = "Pixel Knight";
        this.description = "A classic Knight that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export class PixelBishop extends ClassicBishop{
    constructor(color){
        super(color);
        this.name = "PixelBishop";
        this.cost = 400;
        this.label = "Pixel Knight";
        this.description = "A classic Bishop that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export class PixelQueen extends ClassicQueen{
    constructor(color){
        super(color);
        this.name = "PixelQueen";
        this.cost = 400;
        this.label = "Pixel Queen";
        this.description = "A classic Queen that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export class PixelKing extends ClassicKing{
    constructor(color){
        super(color);
        this.name = "PixelKing";
        this.cost = 400;
        this.label = "Pixel King";
        this.description = "A classic King that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.mark_pos = -1;
        this.set_name = "Pixel";
    }

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        board = putMark(move, board, this.mark_pos, this.mark);
        this.mark_pos = move.from;
        this.mark.piece_pos = move.to;
        return board;
    }
}

export default PixelPawn;
