import { WHITE, BLACK, SQUARES, ALLOWED, ALLOWED_MAPPING, MOVE_MASK, COLORS_NAME } from '../constants'
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
		this.can_castel = false;
		this.behavior = behavior;
		this.behavior_size = 239;
		this.behavior_offset = (this.behavior_size - 1) / 2;
		this.is_king = false;
		this.cost = cost;
		this.is_pawn = false;
		this.can_be_eaten = true;
		this.name = name;
		this.color = color;
		this.image = "/assets/pieces/" + name + COLORS_NAME[color] + ".svg";
		this.label = label;
		this.allowed = allowed;
		this.moved = false;
		this.mark = null;
		this.is_mark = false;
		this.is_deadly = false;
		this.linked_square = -1;
		this.description = description;
		this.set_name = "No set";
		this.display_number = null;
		this.pieces_linked = [];
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

	getDisplayNumber(){
		return this.display_number;
	}

	//some pieces can check where they cannot go
	getLegalCheckSquares(board, square, last_move, is_rock_check = true){
		return this.getLegalSquares(board, square, last_move, is_rock_check = true);
	}
	//pour une BOARD donnée et une case SQUARE donnée, verifie toute les cases atteignables
	//return une liste de case possible sous forme texte.
	getLegalSquares(board, square, last_move, is_rock_check = true){
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
		if (this.behavior[index] && this.isOnBoard(target_pos, board)){
			if ((this.isAlly(board, target_pos) && this.canAttackAlly(index) && this.isEdible(board, target_pos) && !this.isKing(board, target_pos))
				|| (this.isEnemy(board, target_pos) && this.canAttack(index) && this.isEdible(board, target_pos))
				|| (this.isEmpty(board, target_pos) && this.canMove(index) && !(this.is_king && this.isDeadly(board, target_pos))))
			{
				if (this.canSeeThrough(index) || this.isInSight(board, pos, target_pos)){
					return (target_pos);
				}
			}
			if (is_rock_check && this.CanCastel(board, target_pos, pos, index, last_move)){
				return (target_pos);
			}
			if (this.checkPassant(board, target_pos, pos, last_move) && this.canAttack(index)){
				return (target_pos);
			}
			if (this.canMoveSpecial(index) && this.isSpecialPossible(board, target_pos, pos)){
				return (target_pos);
			}
		}
		return -1;
	}

	//update the status of the piece related to the board_width
	//override to update a piece on a special board configuration, exemple : DragonEgg.svg
	updateStatusFromBoard(board, square, game_events, nb_captures){
        return this.getMoveResult(board, nb_captures, game_events);
    }

	//check if En Passant is possible
	//override in Pawn classes, exemple : ClassicPawn.svg
	checkPassant(board, target_pos, pos, last_move){
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

	canMoveSpecial(index){
		let target = this.behavior[index];
		return target & MOVE_MASK.SPECIAL_MOVE;
	}

	isEdible(board, target_pos){
		return board[target_pos].can_be_eaten;
	}

	//Check if the targeted position for the piece in pos position ca n do a special action
	//override to make a condition on a special move : exemple Reaper.svg, DragonEgg.svg
	isSpecialPossible(board, target_pos, pos){
		return false;
	}

	isDeadly(board, target_pos){
		if (board[target_pos]){
			return board[target_pos].is_deadly;
		}
		return false;
	}

	CanCastel(board, target_pos, pos){
		return (false);
	}

	isKing(board, target_pos){
		return board[target_pos].is_king;
	}

	isOnBoard(pos, board){
		let board_width = Math.sqrt(board.length / 2);
		if (pos < 0
			|| pos > board.length - board_width
			|| pos % (board_width * 2) >= board_width){
			return false;
		}
		return true;
	}

	getTargetPos(index, pos){
		return (index - this.behavior_offset + pos);
	}

	isEmpty(board, target_pos){
		if (board[target_pos] && !board[target_pos].is_mark){
			return false;
		}
		return true;
	}

	isAlly(board, target_pos){
		return (board[target_pos] && board[target_pos].color === this.color && !board[target_pos].is_mark);
	}

	isEnemy(board, target_pos){
		return (board[target_pos] && board[target_pos].color !== this.color && !board[target_pos].is_mark);
	}

	isInSight(board, pos, target_pos){
		let board_width = Math.sqrt(board.length / 2);
		if (pos % board_width === target_pos % board_width && this.isInSightCol(board, pos, target_pos)){
			return true;
		} else if (Math.abs(pos - target_pos) < board_width && this.isInSightLine(board, pos, target_pos)){
			return true;
		} else if (	Math.abs(Math.floor(pos / (board_width * 2)) - Math.floor(target_pos / (board_width * 2))) == Math.abs(pos % board_width - target_pos % board_width)
					&& this.isInSightDiag(board, pos, target_pos)){
			return true;
		}
		return false;
	}

	isInSightCol(board, pos, target_pos){
		let board_width = Math.sqrt(board.length / 2);
		let min = Math.min(pos, target_pos) + board_width * 2;
		let max = Math.max(pos, target_pos);
		while (min < max){
			if (board[min] && !board[min].is_mark){
				return false;
			}
			min += board_width * 2;
		}
		return true;
	}

	isInSightLine(board, pos, target_pos){
		let min = Math.min(pos, target_pos) + 1;
		let max = Math.max(pos, target_pos);
		while (min < max){
			if (board[min] && !board[min].is_mark){
				return false;
			}
			min += 1;
		}
		return true;
	}

	isInSightDiag(board, pos, target_pos){
		let board_width = Math.sqrt(board.length / 2);
		let min = Math.min(pos, target_pos);
		let max = Math.max(pos, target_pos);
		let increment;
		if (min % board_width > max % board_width){
			increment = board_width * 2 - 1;
		} else {
			increment = board_width * 2 + 1;
		}
		min += increment;
		while (min < max){
			if (board[min] && !board[min].is_mark){
				return false;
			}
			min += increment;
		}
		return true;
	}

	//deleteElementFromMove delete an element because a piece made a move on it.
	//override to do a special action when steppedOver : exemple DeadlyMark.svg
	deleteElementFromMove(move, board){
		if (board[move.to]){//if there is a piece
			board = board[move.to].deleteElementFromSquare(move.to, board);
		}
		return board;
	}

	//deleteElementFromSquare delete an element but not related to a move.
	//override to do a special action when the piece die : exemple Pixel.svg
	deleteElementFromSquare(square, board){
		if (this.can_be_eaten){
			board[square] = null;
		}
		return board;
	}

	move(move, board, last_move, game_events){
		this.moved = true;
		let nb_captures = this.isEmpty(board, move.to) ? 0 : 1
		if (board[move.to]){
			board = board[move.to].deleteElementFromMove(move, board);
		}
		board[move.to] = board[move.from];
		board[move.from] = null;
		if (move.action){
			if (move.action.into){ //transformation
				if(board[move.to].is_pawn){
					game_events[board[move.to].color]["PromotePawn"] += 1;
				}
				board[move.to] = new PIECE_MAPPING[move.action.into](board[move.to].color);
			}
			// <- other kind of global action
		}
		return this.getMoveResult(board, nb_captures, game_events);
	}

	getMoveResult(board, nb_captures, game_events){
		let move_result = {
			board: board,
			nb_captures: nb_captures,
			game_events: game_events
		}
		return move_result;
	}
}

export default Piece;
