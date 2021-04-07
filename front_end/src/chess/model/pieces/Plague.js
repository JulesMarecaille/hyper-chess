import ClassicPawn from './ClassicPawn.js'
import {ALLOWED} from '../constants.js'
import PieceDraw from '../../ui/PieceDraw.js'

class Plague extends ClassicPawn{
	constructor(color,
		size = 1,
		description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals.",
		allowed = ALLOWED.PAWN)
	{
        super(color)
		this.behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 6, 5, 6, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.name = 'Plague';
        this.label = 'Plague';
        this.size = size;
        this.description = description;
        this.allowed = allowed;
		this.value = size;
        this.cost = 400;
		this.display_number = size;
		this.draw = <PieceDraw piece={this}/>;
		this.draw_display_number = <div className="overlay-number">{this.display_number}</div>;
	}

    move(move, board, last_move){
		if (this.checkPassant(board, move.to, move.from, last_move)){
			board[last_move.to] = null;
		}
        //move from = split + ally hord move.to, will be put on to
		let new_board = super.move(move, board, last_move);//remove the super ?
        //move from = replacer le relicat en cas de split
		return new_board;
	}
}

export class PlagueOne extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued";
		super(color, 1, description, ALLOWED.PAWN);
		this.name = "PlagueOne";
		this.label = "Plague One";
	}
}

export class PlagueThree extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Three plagued pawn";
		super(color, 3, description, ALLOWED.KNIGHT | ALLOWED.BISHOP);
		this.name = "PlagueThree";
		this.label = "Plague Three";
	}
}

export class PlagueFive extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Five plagued pawn";
		super(color, 5, description, ALLOWED.ROOK);
		this.name = "PlagueFive";
		this.label = "Plague Five";
	}
}

export class PlagueNine extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Nine plagued pawn";
		super(color, 9, description, ALLOWED.QUEEN);
		this.name = "PlagueNine";
		this.label = "Plague Nine";
	}
}

export default PlagueOne;
