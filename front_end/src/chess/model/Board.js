import 'model/constants.js'

class Board {
	constructor(player_white, player_black) {
		this.board = new Array(128);
		this.color_to_move = WHITE; // White starts the game
		this.player_white = player_white;
		this.player_black = player_black;
		this.kings_positions = [0, 0];
		this.has_castled = [false, false];
		this.history = [];
		this.initialize_board(this.player_white, this.player_black);
	}

	get_legal_moves_from_player(color){
		all_legal_moves = [];
		for (square=0; square < 128; square++) {
			piece = this.board[square]
			// If there's a piece on this square and this piece belongs to the player
			if (piece && piece.color === color){
				all_legal_moves.push(get_legal_moves_from_piece(piece, square));
			}
		}
		return all_legal_moves;
	}

	get_legal_moves_from_piece(piece, square){
		return piece.get_legal_moves(this.board, square);
	}

	initialize_board(player1, player2){
		// TODO
		// Get the deck of each player
		// Put the pieces in the right squares
	}

	make_move(move){
		this.update_history(move);

		// Move the piece
		this.board = this.board[move.from].move(move, board)
	}

	update_history(move){
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

function _swap_color(color){
	if (color == WHITE){
		return BLACK;
	}
	return WHITE;
}
