import { WHITE, BLACK, SQUARES, ALLOWED, ALLOWED_MAPPING, MOVE_MASK} from '../constants.js'
import {PIECE_MAPPING} from './index.js'

function reverseBehavior(table){
	let top = 0;
	let bottom = 224;
	while (top < bottom){
		let k = 0;
		while (k < 16){
			let tmp = table[top + k];
			table[top + k] = table[bottom + k];
			table[bottom + k] = tmp;
			k++;
		}
		top += 16;
		bottom -= 16;
	}
	return table;
}

class Piece{
	//matrice des déplacement des différente pièces en bitwise : pour chaque pièce deux bits sont assigné, un de poids faible pour la capacité de se mouvoir,
	//l'autre pour la capacité de manger. Le centre en 7,7 représente la piece, et au tour les différents codes.
	//
	constructor(color, behavior, name, label, value, description, allowed, cost){
		this.value = value;
		this.rockable = false;
		this.behavior = behavior;
		this.behavior_size = 239;
		this.behavior_offset = (this.behavior_size - 1) / 2;
		this.is_king = false;
		this.cost = cost;
		this.is_pawn = false;
		this.can_be_eaten = true;
		this.name = name;
		this.label = label;
		this.allowed = allowed;
    	this.color = color;
		this.moved = false;
		this.description = description;
		this.set_name = "No set";
		if (this.color === BLACK){
			this.behavior = reverseBehavior(this.behavior);
		}
  	}


	makeAction(move, selection){//will return a new, altered move to do according to the selection
		return null;			//we might wanna add a list of moves, if we want to make other pieces moves
	}

	getAction(){//will display a table of possibilities to do for a move, the user will have to select
		return null;
	}

	//pour une BOARD donnée et une case SQUARE donnée, verifie toute les cases atteignables
	//return une liste de case possible sous forme texte.
	getLegalMoves(board, square, last_move, is_rock_check = true){
		let pos;
		let legal_move = [];
		for (let k = 0; k < this.behavior_size; k++){
			if ((pos = this.checkAvailableSquare(square, k, board, last_move, is_rock_check)) !== -1){
				legal_move.push(pos);
			}
		}
		return legal_move;
	}

	hasStartingPosition(string){
		let stri_up = string.toUpperCase();
		return ALLOWED_MAPPING[stri_up] & this.allowed ? true : false;//return a true instead of a number
	}

	// Pour une piece d'ID defini, en position POS : verifie si la case d'index INDEX de sa matrice est possible à atteindre su la BOARD
	// return le nom de la case si possible, null sinon
	checkAvailableSquare(pos, index, board, last_move, is_rock_check){
		let target_pos = this.getTargetPos(index, pos);
		if ((this.behavior[index] && this.isOnBoard(target_pos))){
			if ((this.isAlly(board, target_pos) && this.canAttackAlly(index) && this.isEdible(board, target_pos) && !this.isKing(board, target_pos))
				|| (this.isEnemy(board, target_pos) && this.canAttack(index) && this.isEdible(board, target_pos))
				|| (this.isEmpty(board, target_pos) && this.canMove(index)))
			{
				if (this.canSeeThrough(index) || this.isInSight(board, pos, target_pos)){
					return (target_pos);
				}
			}
			if (is_rock_check && this.isRockable(board, target_pos, pos, index, last_move)){
				return (target_pos);
			}
			if (this.checkPassant(board, target_pos, pos, last_move)){
				return (target_pos);
			}
		}
		return -1;
	}

	checkPassant(board, target_pos, pos, last_move){//to be overwrite by pawn
		return false;
	}

	canAttackAlly(index){
		let target = this.behavior[index];
		return target & MOVE_MASK.ATTACK_ALLY;
	}

	canAttack(index){
		let target = this.behavior[index];
		return target & MOVE_MASK.ATTACK;
	}

	canSeeThrough(index){
		let target = this.behavior[index];
		return target & MOVE_MASK.SEE_THROUGH;
	}

	canMove(index){
		let target = this.behavior[index];
		return target & MOVE_MASK.MOVE;
	}

	isEdible(board, target_pos){
		return board[target_pos].can_be_eaten;
	}

	isRockable(board, target_pos, pos){
		return (false);
	}

	isKing(board, target_pos){
		return board[target_pos].is_king;
	}

	isOnBoard(pos){
		if (pos < 0
			|| pos > 127
			|| pos % 16 > 7){
			return false;
		}
		return true;
	}

	getTargetPos(index, pos){
		return (index - this.behavior_offset + pos);
	}

	isEmpty(board, target_pos){
		return board[target_pos] ? false : true;
	}

	isAlly(board, target_pos){
		return (board[target_pos] && board[target_pos].color === this.color);
	}

	isEnemy(board, target_pos){
		return (board[target_pos] && board[target_pos].color !== this.color);
	}


	isInSight(board, pos, target_pos){
		if (pos % 8 === target_pos % 8 && this.isInSightCol(board, pos, target_pos)){
			return true;
		} else if (Math.abs(pos - target_pos) < 8 && this.isInSightLine(board, pos, target_pos)){
			return true;
		} else if (	Math.abs(Math.floor(pos / 16) - Math.floor(target_pos / 16)) == Math.abs(pos % 8 - target_pos % 8)
					&& this.isInSightDiag(board, pos, target_pos)){
			return true;
		}
		return false;
	}

	isInSightCol(board, pos, target_pos){
		let min = Math.min(pos, target_pos) + 16;
		let max = Math.max(pos, target_pos);
		while (min < max){
			if (board[min]){
				return false;
			}
			min += 16;
		}
		return true;
	}

	isInSightLine(board, pos, target_pos){
		let min = Math.min(pos, target_pos) + 1;
		let max = Math.max(pos, target_pos);
		while (min < max){
			if (board[min]){
				return false;
			}
			min += 1;
		}
		return true;
	}

	isInSightDiag(board, pos, target_pos){
		let min = Math.min(pos, target_pos);
		let max = Math.max(pos, target_pos);
		let increment;
		if (min % 8 > max % 8){
			increment = 15;
		} else {
			increment = 17;
		}
		min += increment;
		while (min < max){
			if (board[min]){
				return false;
			}
			min += increment;
		}
		return true;
	}

	move(move, board, last_move){
		this.moved = true;
		board[move.to] = board[move.from];
		board[move.from] = null;
		if (move.action){
			if (move.action.into){ //transformation
				board[move.to] = new PIECE_MAPPING[move.action.into](board[move.to].color);
			}
			// <- other kind of global action
		}
		return board;
	}
}

export default Piece;
