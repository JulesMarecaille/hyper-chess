import { WHITE, BLACK, SQUARES } from '../constants.js'
import Piece from './Piece.js'

function isSquareChecked(board, square, color)
{
	let index = 0;
	let list = [];
		
	while (index < 128)
	{	
		if (board[index] && board[index].color !== color && board[index])
		{
			list = board[index].getLegalMoves(board, index, 0); 
			if (list.includes(square))
				return (true);
		}
		index++;
	}
	return (false);
}

class ClassicKing extends Piece
{
	constructor(color)
	{
		let behavior = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 16, 7, 0, 7, 16, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		super(color, behavior, 'ClassicKing', 1);
		this.is_king = true;
	}

	isRockable(board, target_pos, pos, index)
	{
		let target = this.behavior[index];
		if (target & (1 << 4) && !this.moved)
		{
			let mate;
			if (target_pos < pos) //rock aile reine
			{
				mate = board[target_pos - 2];
				for (let k = 1; k <  4; k++)
				{
					if (isSquareChecked(board, pos - k, this.color)
						|| !this.isEmpty(board, pos - k))
						return (false);
				}
			}
			else
			{
				mate = board[target_pos + 1];
				for (let k = 1; k <  3; k++)
				{
					if (isSquareChecked(board, pos + k, this.color)
						|| !this.isEmpty(board, pos + k))
						return (false);
				}
			}
			if (!mate)
				return (false);
			if (mate.moved || !mate.rockable)
				return (false);
			if (isSquareChecked(board, pos))
				return (false);
			return (true);
		}
		return (false);
	}

	move(move_struct, board)
	{

		board = super.move(move_struct, board);
		if (Math.abs(move_struct.to - move_struct.from) === 2)
		{
			if (move_struct.to > move_struct.from)
			{
				board[move_struct.to - 1] = board[move_struct.to + 1];
				board[move_struct.to + 1] = null;
			}
			else if (move_struct.to < move_struct.from)
			{
				board[move_struct.to + 1] = board[move_struct.to - 2];
				board[move_struct.to - 2] = null;
			}
		}
		return (board);
	}

}

export default ClassicKing;
