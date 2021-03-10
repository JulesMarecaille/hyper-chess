import { WHITE, BLACK, SQUARES, swapColor } from './constants.js'
import { createClassicDeck } from './utils.js';
import { cloneDeep } from "lodash"
import { PIECE_MAPPING } from './pieces'

class Board {
	constructor(deck_white, deck_black) {
		this.board = new Array(128);
		this.color_to_move = WHITE; // White starts the game
		this.deck_white = createClassicDeck();
		this.deck_black = createClassicDeck();
		this.kings_positions = {}
		this.is_check = {}
		this.history = [];
		this.game_over = false;
		this.is_draw = false;
		this.winner = null;
		this.initializeBoard(this.player_white, this.player_black);
	}

	getLegalMovesFromPiece(square){
		return getLegalMovesFromPieceFromBoard(this.board, square, this.kings_positions, this.getLastMove(), true)
	}

	getLegalMovesFromPlayer(color){
		return getLegalMovesFromPlayerFromBoard(this.board, color, this.kings_positions, this.getLastMove(), true)
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
		// Move the piece
		this.board = this.board[move.from].move(move, this.board, this.getLastMove());

		this.updateHistory(move);
		this.updateKingPosition();

		// Change turn
		this.color_to_move = swapColor(this.color_to_move);
		this.updateHasGameEnded();
		return this.game_over, this.is_draw, this.winner;
	}

	updateHistory(move){
		this.history.push(move)
	}

	updateKingPosition(){
		for(let square = 0; square < 128; square++){
			let piece = this.board[square];
			if(piece && piece.is_king){
				this.kings_positions[piece.color] = square;
				this.is_check[piece.color] = this.isCheck(piece.color);
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

	getLastMove(){
		return this.history.slice(-1)[0];
	}
}

function getLegalMovesFromPieceFromBoard(
	board,
	square,
	kings_positions,
	opponent_last_move,
	check_king_safety=true){
	// Get where the piece can go to
	let piece = board[square]
	let candidate_squares = piece.getLegalMoves(board, square, opponent_last_move);
	let legal_moves = []
	for (let candidate_square of candidate_squares){
		// Check if this move put our king in danger
		if (check_king_safety){
			// Simulate the piece move
			let move = {
				'to': candidate_square,
				'from': square,
				'player': piece.color
			};
			let tmp_board = cloneDeep(board)
			tmp_board = tmp_board[square].move(move, tmp_board, opponent_last_move);
			// See if our opponent can capture our king after our move
			// The opponent can capture our king regardless of his king safety
			let opponent_moves = getLegalMovesFromPlayerFromBoard(tmp_board, swapColor(piece.color), kings_positions, move, false);
			if (opponent_moves.includes(kings_positions[piece.color])){
				continue;
			}
		}
		legal_moves.push(candidate_square);
	}
	return legal_moves;
}

function getLegalMovesFromPlayerFromBoard(
	board,
	color,
	kings_positions,
	opponent_last_move,
	check_king_safety=true){
	let all_legal_moves = [];
	for (let square = 0; square < 128; square++) {
		const piece = board[square]
		// If there's a piece on this square and this piece belongs to the player
		if (piece && piece.color === color){
			let piece_moves = getLegalMovesFromPieceFromBoard(board, square, kings_positions, opponent_last_move, check_king_safety)
			all_legal_moves = all_legal_moves.concat(piece_moves);
		}
	}
	return all_legal_moves;
}

export default Board
