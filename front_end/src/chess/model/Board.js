import { WHITE, BLACK, SQUARES } from './constants.js'

class Board {
	constructor(player_white, player_black) {
		this.board = new Array(128);
		this.color_to_move = WHITE; // White starts the game
		this.player_white = player_white;
		this.player_black = player_black;
		this.kings_positions = [0, 0];
		this.has_castled = [false, false];
		this.history = [];
		this.initializeBoard(this.player_white, this.player_black);
	}

	getLegalMovesFromPiece(piece, square){
		return piece.GetLegalMoves(this.board, square);
	}

	getLegalMovesFromPlayer(color){
		let all_legal_moves = [];
		for (let square = 0; square < 128; square++) {
			const piece = this.board[square]
			// If there's a piece on this square and this piece belongs to the player
			if (piece && piece.color === color){
				all_legal_moves.push(this.getLegalMovesFromPiece(piece, square));
			}
		}
		return all_legal_moves;
	}

	initializeBoard(player1, player2){
		// TODO
		// Get the deck of each player
		// Put the pieces in the right squares
		this.board[7] = {'name': 'ClassicPawn', 'color':WHITE}
		this.board[67] = {'name': 'ClassicKing', 'color':BLACK}
	}

	makeMove(move){
		this.updateHistory(move);

		// Move the piece
		this.board = this.board[move.from].move(move, this.board)
	}

	updateHistory(move){
		this.history.push(move)
	}
}

/*****************************************************************************
* UTILITY FUNCTIONS
****************************************************************************/
function _rank(i) {
	return i >> 4
}

function _file(i) {
	return i & 15
}

export default Board
