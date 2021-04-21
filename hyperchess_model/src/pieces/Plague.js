import ClassicPawn from './ClassicPawn.js'
import {ALLOWED} from '../constants'

class Plague extends ClassicPawn{
	constructor(color,
		size = 1,
		description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals.",
		allowed = ALLOWED.PAWN)
	{
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 26, 25, 26, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        super(color, behavior);
		this.name = 'Plague';
        this.label = 'Plague';
        this.size = size;
        this.description = description;
        this.allowed = allowed;
		this.value = size;
        this.cost = 750;
		this.display_number = size;
		this.image = null;
		this.is_type_plague = true;
	}

	isPlague(board, target_pos){
		if (board[target_pos] && board[target_pos].is_type_plague){
			return true;
		}
	}

	getNameOfSize(size){
		if (size < 5){
			return size > 2 ? "PlagueThree" : "PlagueOne";
		} else {
			return size > 8 ? "PlagueNine" : "PlagueFive";
		}
	}

	getDisplayNumber(){
		if (this.display_number > 1){
			return this.display_number;
		}
		return null;
	}

	checkAvailableSquare(pos, index, board, last_move){
		let target_pos = this.getTargetPos(index, pos);
		if ((this.behavior[index] && this.isOnBoard(target_pos, board))){
			if ((this.isAlly(board, target_pos)
					&& this.canAttackAlly(index)
					&& this.isPlague(board, target_pos)
					&& this.isEdible(board, target_pos)
					&& (this.size > 1 || this.canMove(index)))
				|| (this.isEnemy(board, target_pos) && this.canAttack(index) && this.isEdible(board, target_pos))
				|| (this.isEmpty(board, target_pos)
					&& (this.canMove(index) || (this.canAttack(index) && this.size > 1))))
			{
				return (target_pos);
			}
			if (this.checkPassant(board, target_pos, pos, last_move)){
				return (target_pos);
			}
		}
		return -1;
	}

	actualizePlague(plagued, size){
		plagued.size = size;
		plagued.display_number = size;
		plagued.name = this.getNameOfSize(size);
	}

    move(move, board, last_move){
		this.moved = true;
		let the_rest = null;
		let size;
		let board_width = Math.sqrt(board.length / 2);
		if (this.checkPassant(board, move.to, move.from, last_move)){
			board[last_move.to] = null;
		}
		if (move.from % board_width !== move.to % board_width && board[move.from].size !== 1){
			size = board[move.from].size;
			this.actualizePlague(board[move.from], Math.floor(size / 2));
			the_rest = new Plague(this.color, size - board[move.from].size);
			the_rest.name = this.getNameOfSize(the_rest.size);
		}
        if (this.isPlague(board, move.to) && this.isAlly(board, move.to)){
			this.actualizePlague(board[move.from], board[move.from].size + board[move.to].size);
		}
		board = super.move(move, board, last_move);
		board[move.from] = the_rest; //replace the rest of the plague
		return board;
	}
}

export class PlagueOne extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued";
		super(color, 1, description, ALLOWED.PAWN);
		this.name = "PlagueOne";
		this.label = "Plague Stage One";
	}
}

export class PlagueThree extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Three plagued pawn";
		super(color, 3, description, ALLOWED.KNIGHT | ALLOWED.BISHOP);
		this.name = "PlagueThree";
		this.label = "Plague Stage Three";
	}
}

export class PlagueFive extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Five plagued pawn";
		super(color, 5, description, ALLOWED.ROOK);
		this.name = "PlagueFive";
		this.label = "Plague Stage Five";
	}
}

export class PlagueNine extends Plague{
	constructor(color){
		let description = "Similar to the Classic Pawn, but it can also merge with other Plagued. It can split in half on the diagonals. It contain Nine plagued pawn";
		super(color, 9, description, ALLOWED.QUEEN);
		this.name = "PlagueNine";
		this.label = "Plague Stage Nine";
	}
}

export default PlagueOne;
