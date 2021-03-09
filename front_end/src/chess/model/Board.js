import { WHITE, BLACK, SQUARES, swapColor } from './constants.js'
import { createClassicDeck } from './utils.js';
import { PIECE_MAPPING } from './pieces'

class Board {
	constructor(deck_white, deck_black) {
		this.board = new Array(128);
		this.color_to_move = WHITE; // White starts the game
		this.deck_white = createClassicDeck();
		this.deck_black = createClassicDeck();
		this.kings_positions = {}
		this.history = [];
		this.game_over = false;
		this.is_draw = false;
		this.winner = null;
		this.initializeBoard(this.player_white, this.player_black);
	}

	getLegalMovesFromPiece(piece, square){
		return piece.getLegalMoves(this.board, square);
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

	initializeBoard(){
		let white_pieces = this.deck_white.getPiecesAsWhite()
		let black_pieces = this.deck_black.getPiecesAsBlack()
		for (const [square, piece_name] of Object.entries(white_pieces)){
			this.board[square] = new PIECE_MAPPING[piece_name](WHITE);
		}

		for (const [square, piece_name] of Object.entries(black_pieces)){
			this.board[square] = new PIECE_MAPPING[piece_name](BLACK);
		}
		this.updateKingPosition();
	}

	makeMove(move){
		// If game is over we can't make moves anymore
		if (this.game_over){
			return this.game_over, this.is_draw, this.winner;
		}
		this.updateHistory(move);

		// Move the piece
		this.board = this.board[move.from].move(move, this.board);

		// Update where the kings are
		this.updateKingPosition();

		// Change turn
		this.color_to_move = swapColor(this.color_to_move);

		// Check if game is over
		this.updateHasGameEnded();
		return this.game_over, this.is_draw, this.winner;
	}

	updateHistory(move){
		this.history.push(move)
	}

	updateKingPosition(){
		for(let square = 0; square < 128; square++){
			let piece = this.board[square];
			if(piece && piece.isKing){
				this.kings_positions[piece.color] = square;
			}
		}
	}

	updateHasGameEnded(){
		let is_checkmate = this.isCheckmate(this.color_to_move);
		let is_stalemate = this.isStalemate(this.color_to_move);
		if (is_checkmate || is_stalemate){
			this.game_over = true
			if (is_checkmate){
				// The winner made the last move
				this.winner = swapColor(this.color_to_move);
			} else {
				this.is_draw = true
			}
		}
	}

	isCheck(color){
		let opponent_moves = this.getLegalMovesFromPlayer(swapColor(color))
		return opponent_moves.includes(this.kings_positions[color]);
	}

	isCheckmate(color){
		return !this.getLegalMovesFromPlayer(color) && this.isCheck(color);
	}

	isStalemate(color){
		return !this.getLegalMovesFromPlayer(color) && !this.isCheck(color);
	}
}

export default Board
