import {ALLOWED} from '../constants'
import ClassicPawn from './ClassicPawn.js'
import ClassicRook from './ClassicRook.js'
import ClassicKnight from './ClassicKnight.js'
import ClassicBishop from './ClassicBishop.js'
import ClassicQueen from './ClassicQueen.js'
import ClassicKing from './ClassicKing.js'
import Piece from './Piece.js'


function putMark(move, board, link_pos, mark, piece){
    if (link_pos > -1 && board[link_pos] && board[link_pos].is_mark){
        board[link_pos] = null;
    }
    if (board[move.to]){
        board[move.from] = mark;
        mark.link_pos = move.to;
        piece.link_pos = move.from;
    }
    return board;
}

function diePix(square, board, link_pos, piece){
    if (link_pos > -1 && board[link_pos] && board[link_pos].is_mark){
        board = board[link_pos].die(link_pos, board);
    }
    piece.link_pos = -1;
    board[square] = null;
    return board;
}

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
        this.link_pos = -1;
    }

    onStepOn(move, board){
        if (board[move.from]){
            board[move.from].die(move.from, board);
        }
        return board;
    }
}

export class PixelPawn extends ClassicPawn{
    constructor(color){
        super(color);
        this.name = "PixelPawn";
        this.cost = 400;
        this.label = "Pixel Pawn";
        this.description = "A classic Pawn that leave a deadly mark on its previous position";
        this.mark =  new Mark();
        this.link_pos = -1;
        this.set_name = "Pixel";
    }


    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
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
        this.link_pos = -1;
        this.set_name = "Pixel";
    }

    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
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
        this.link_pos = -1;
        this.set_name = "Pixel";
    }

    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
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
        this.link_pos = -1;
        this.set_name = "Pixel";
    }

    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
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
        this.link_pos = -1;
        this.set_name = "Pixel";
    }

    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
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
        this.link_pos = -1;
        this.set_name = "Pixel";
    }

    die(square, board){return diePix(square, board, this.link_pos, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.link_pos, this.mark, this);
    }
}

export default PixelPawn;
