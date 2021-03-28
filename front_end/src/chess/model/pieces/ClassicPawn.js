import Piece from './Piece.js'
import {ALLOWED} from '../constants.js'

function passedByPawn(move)
{
	let list = [];
	let min = Math.min(move.to, move.from);
	let max = Math.max(move.to, move.from);

	while (min < max)
	{
		min += 16;
		if (min !== max)
			list.push(min);
		return (list);
	}

}

class ClassicPawn extends Piece
{
	constructor(color)
	{
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 6, 5, 6, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let description = "move to 1 forward, can only eat on the two diagonals square forward ";
		super(color, behavior, 'ClassicPawn', 'Classic Pawn', 1, description, ALLOWED.PAWN);
		this.is_pawn = true;
	}

	move(move_struct, board, last_move)
	{
		this.behavior[87] = 0;
		this.behavior[151] = 0;

		//Check if it is enPassant, if so, delete the pawn
		if (this.checkPassant(board, move_struct.to, move_struct.from, last_move))
			board[last_move.to] = null;
		return (super.move(move_struct, board, last_move));
	}

	checkPassant(board, target_pos, pos, last_move)
	{
		if (board[pos] && board[pos].is_pawn)
		{
			if (last_move && board[last_move.to] && board[last_move.to].is_pawn)
			{
				let listes = passedByPawn(last_move);
				if (listes && listes.includes(target_pos))
					return (true);
			}
		}
		return (false);
	}

}

export default ClassicPawn;
