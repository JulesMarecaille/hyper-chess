import Piece from './Piece.js'
import {ALLOWED} from '../constants'

class Empress extends Piece{
	constructor(color){
		let behavior = [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 7, 3, 7, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 7, 0, 3, 0, 7, 0, 0, 0, 0, 0, 0,
			3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 0,
			0, 0, 0, 0, 0, 7, 0, 3, 0, 7, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 7, 3, 7, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0];
		let description = "The perfect combination of a Classic Rook and a Classic Knight.";
		super(color, behavior, 'Empress', 'Empress', 9, description, ALLOWED.QUEEN, 250);
	}
}

export default Empress;
