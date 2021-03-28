import Piece from './Piece.js'
import {ALLOWED} from '../constants.js'

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
		super(color, behavior, 'ClassicQueen', 'Classic Queen', 9, description, ALLOWED.QUEEN);
	}

}

export default ClassicQueen;
