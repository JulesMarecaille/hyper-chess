import { WHITE, BLACK, SQUARES, ALLOWED, ALLOWED_MAPPING } from '../constants.js'

function reverseBehavior(table)
{
	let top = 0;
	let bottom = 224;

	while (top < bottom)
	{
		let k = 0;
		while (k < 16)
		{
			let tmp = table[top + k];
			table[top + k] = table[bottom + k];
			table[bottom + k] = tmp;
			k++;
		}
		top += 16;
		bottom -= 16;
	}
	return (table);
}

class Piece
{
	//matrice des déplacement des différente pièces en bitwise : pour chaque pièce deux bits sont assigné, un de poids faible pour la capacité de se mouvoir,
	//l'autre pour la capacité de manger. Le centre en 7,7 représente la piece, et au tour les différents codes.
	//
	constructor(color, behavior, name, label, value, description, allowed){
		this.value = value;
		this.rockable = false;
		this.behavior = behavior;
		this.behavior_size = 239;
		this.behavior_offset = (this.behavior_size - 1) / 2;
		this.is_king = false;
		this.is_pawn = false;
		this.name = name;
		this.label = label;
		this.allowed = allowed;
    	this.color = color;
		this.moved = false;
		this.description = description;
		if (this.color === BLACK)
		{
			this.behavior = reverseBehavior(this.behavior);
		}
  }


	//pour une BOARD donnée et une case SQUARE donnée, verifie toute les cases atteignables
	//return une liste de case possible sous forme texte.
	getLegalMoves(board, square, last_move, is_rock_check = true)
	{
		let pos;
		let legal_move = [];
		for (let k = 0; k < this.behavior_size; k++) //ballade sur les case d'attack
		{
			if ((pos = this.checkAvailableSquare(square, k, board, last_move, is_rock_check)) !== -1)
				legal_move.push(pos);
		}
		return legal_move;
	}

	hasStartingPosition(string){
		let stri_up = string.toUpperCase();
		return (ALLOWED_MAPPING[stri_up] & this.allowed ? true : false);
	}

	// Pour une piece d'ID defini, en position POS : verifie si la case d'index INDEX de sa matrice est possible à atteindre su la BOARD
	// return le nom de la case si possible, null sinon
	checkAvailableSquare(pos, index, board, last_move, is_rock_check)
	{
		let target_pos = this.getTargetPos(index, pos);
		if ((this.behavior[index] && this.isOnBoard(target_pos)))//si c'est une case atteignable et existante
		{
			if ((this.isAlly(board, target_pos) && this.canAttackAlly(index))
				|| (this.isEnemy(board, target_pos) && this.canAttack(index))
				|| (this.isEmpty(board, target_pos) && this.canMove(index)))
			{
				if (this.canSeeThrough(index))
					return (target_pos);
				else if (this.isInSight(board, pos, target_pos))
					 return (target_pos);
			}
			if (is_rock_check && this.isRockable(board, target_pos, pos, index, last_move))
				return (target_pos);
			if (this.checkPassant(board, target_pos, pos, last_move))
				return (target_pos);
		}
		return (-1);
	}

	checkPassant(board, target_pos, pos, last_move)
	{
		return (false);
	}

	canAttackAlly(index)
	{
		let target = this.behavior[index];
		return (target & (1 << 3))
	}

	canAttack(index)
	{
		let target = this.behavior[index];
		return (target & (1 << 1))
	}

	canSeeThrough(index)
	{
		let target = this.behavior[index];
		return (target & (1 << 2))
	}

	canMove(index)
	{
		let target = this.behavior[index];
		return (target & 1)

	}

	isRockable(board, target_pos, pos)
	{
		return (false);
	}

	isOnBoard(pos)
	{
		if (pos < 0 || pos > 127)
			return false;
		if (pos % 16 > 7)
			return false;
		return true;
	}

	getTargetPos(index, pos)
	{
		return (index - this.behavior_offset + pos);
	}

	isEmpty(board, target_pos)
	{
		if (board[target_pos])
			return false;
		return true;
	}

	isAlly(board, target_pos)
	{
		return (board[target_pos] && board[target_pos].color === this.color);
	}

	isEnemy(board, target_pos)
	{
		return (board[target_pos] && board[target_pos].color !== this.color);
	}


	isInSight(board, pos, target_pos)
	{
		if (pos % 8 === target_pos % 8 && this.isInSightCol(board, pos, target_pos))
			return true;
		else if (Math.abs(pos - target_pos) < 8 && this.isInSightLine(board, pos, target_pos))
			return true;
		else if (Math.abs(Math.floor(pos / 16) - Math.floor(target_pos / 16)) == Math.abs(pos % 8 - target_pos % 8) && this.isInSightDiag(board, pos, target_pos))
			return true;
		return false;
	}

	isInSightCol(board, pos, target_pos)
	{
		let min = Math.min(pos, target_pos) + 16;
		let max = Math.max(pos, target_pos);

		while (min < max)
		{
			if (board[min])
				return false;
			min += 16;
		}
		return true;
	}

	isInSightLine(board, pos, target_pos)
	{
		let min = Math.min(pos, target_pos) + 1;
		let max = Math.max(pos, target_pos);

		while (min < max)
		{
			if (board[min])
				return false;
			min += 1;
		}
		return true;
	}

	isInSightDiag(board, pos, target_pos)
	{
		let min = Math.min(pos, target_pos);
		let max = Math.max(pos, target_pos);
		let increment;

		if (min % 8 > max % 8)
			increment = 15;
		else
			increment = 17;
		min += increment;

		while (min < max)
		{
			if (board[min])
				return false;
			min += increment;
		}
		return true;
	}

	move(move_struct, board, last_move)
	{
		this.moved = true;
		board[move_struct.to] = board[move_struct.from];
		board[move_struct.from] = null;
		return (board);
	}
}

export default Piece;
