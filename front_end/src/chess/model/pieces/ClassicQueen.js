import { WHITE, BLACK, SQUARES } from '../constants.js'
import Piece from './Piece.js'

class ClassicQueen extends Piece
{
	constructor(color)
	{
		let behavior = [3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0,
			0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0,
			0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0,
			0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0,
			0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0,
			3, 3, 3, 3, 3, 3, 7, 0, 7, 3, 3, 3, 3, 3, 3, 0,
			0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0,
			0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0,
			0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0,
			0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0,
			3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3];
		let description = "move on diagonals and on lines : one of the strongest pieces";
		super(color, behavior, 'ClassicQueen', 9, description);
	}

}

export default ClassicQueen;
