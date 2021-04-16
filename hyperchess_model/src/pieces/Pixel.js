import {ALLOWED, COLORS_NAME} from '../constants'
import ClassicPawn from './ClassicPawn.js'
import ClassicRook from './ClassicRook.js'
import ClassicKnight from './ClassicKnight.js'
import ClassicBishop from './ClassicBishop.js'
import ClassicQueen from './ClassicQueen.js'
import ClassicKing from './ClassicKing.js'
import DeadlyMark from './Mark.js'


function putMark(move, board, linked_square, mark, piece){
    if (linked_square > -1 && board[linked_square] && board[linked_square].is_mark){
        board[linked_square] = null;
    }
    if (board[move.to]){
        board[move.from] = mark;
        mark.linked_square = move.to;
        piece.linked_square = move.from;
    }
    return board;
}

function deleteElementFromSquarePixel(square, board, linked_square, piece){
    if (linked_square > -1 && board[linked_square] && board[linked_square].is_mark){
        board = board[linked_square].deleteElementFromSquare(linked_square, board);
    }
    piece.linked_square = -1;
    board[square] = null;
    return board;
}

export class PixelPawn extends ClassicPawn{
    constructor(color){
        super(color);
        this.name = "PixelPawn";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel Pawn";
        this.description = "A classic Pawn that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }


    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export class PixelRook extends ClassicRook{
    constructor(color){
        super(color);
        this.name = "PixelRook";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel Rook";
        this.description = "A classic Rook that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }

    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export class PixelKnight extends ClassicKnight{
    constructor(color){
        super(color);
        this.name = "PixelKnight";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel Knight";
        this.description = "A classic Knight that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }

    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export class PixelBishop extends ClassicBishop{
    constructor(color){
        super(color);
        this.name = "PixelBishop";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel Knight";
        this.description = "A classic Bishop that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }

    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export class PixelQueen extends ClassicQueen{
    constructor(color){
        super(color);
        this.name = "PixelQueen";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel Queen";
        this.description = "A classic Queen that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }

    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export class PixelKing extends ClassicKing{
    constructor(color){
        super(color);
        this.name = "PixelKing";
        this.image = "/assets/pieces/" + this.name + COLORS_NAME[color] + ".svg";
        this.cost = 750;
        this.label = "Pixel King";
        this.description = "A classic King that leave a deadly mark on its previous position";
        this.mark =  new DeadlyMark();
        this.linked_square = -1;
        this.set_name = "Pixel";
    }

    deleteElementFromSquare(square, board){return deleteElementFromSquarePixel(square, board, this.linked_square, this);}

    move(move, board, last_move){
        board = super.move(move, board, last_move);
        return putMark(move, board, this.linked_square, this.mark, this);
    }
}

export default PixelPawn;
