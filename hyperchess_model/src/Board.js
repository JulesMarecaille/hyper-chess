import { WHITE, BLACK, SQUARES, swapColor } from './constants'
import { cloneDeep } from "lodash"
import { PIECE_MAPPING } from './pieces'

class Board {
	constructor(deck_white, deck_black) {
		this.board = new Array(128);
		this.color_to_move = WHITE; // White starts the game
		this.deck_white = deck_white;
		this.deck_black = deck_black;
		this.kings_positions = {}
		this.is_check = {}
		this.history = [];
		this.game_over = false;
		this.is_draw = false;
		this.winner = null;
		this.initializeBoard(this.player_white, this.player_black);
	}

	isMoveLegal(move){
		if(move.player_color == this.color_to_move){
			return isMoveLegalFromBoard(this.board, this.kings_positions, move, this.getLastMove(), this.board[move.from]);
		}
		return false;
	}

	isThereALegalMoveFromPlayer(color) {
		   return isThereALegalMoveFromPlayerFromBoard(this.board, color, this.kings_positions, this.getLastMove(), true)
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
			if (piece_name){
				this.board[square] = new PIECE_MAPPING[piece_name](WHITE);
			}
		}

		for (const [square, piece_name] of Object.entries(black_pieces)){
			if (piece_name){
				this.board[square] = new PIECE_MAPPING[piece_name](BLACK);
			}
		}
		this.updateKingPosition();
	}

	getAction(move){
		return this.board[move.from].getAction(move);
	}

	makeAction(move, selection){
		return this.board[move.from].makeAction(move, selection);
	}

	makeMove(move){
		// If game is over we can't make moves anymore
		if (this.game_over){
			return this.game_over, this.is_draw, this.winner, false, false;
		}
		// Check if this move captures a piece
		let is_capture = (!!this.board[move.to]);
		// Move the piece
		this.board = this.board[move.from].move(move, this.board, this.getLastMove());
		this.updateHistory(move);
		this.updateKingPosition();
		// Change turn
		this.color_to_move = swapColor(this.color_to_move);
		let is_check = this.is_check[this.color_to_move];
		this.updateHasGameEnded();
		let game_over = this.game_over;
		let is_draw = this.is_draw;
		let winner = this.winner;
		let pack = {game_over, is_draw, winner, is_capture, is_check};
		return pack;
	}

	updateHistory(move){
		this.history.push(move)
	}

	updateKingPosition(){//too long +-200ms
		for(let square = 0; square < 128; square++){
			let piece = this.board[square];
			if(piece && piece.is_king){
				this.kings_positions[piece.color] = square;
				this.is_check[piece.color] = this.isCheck(piece.color);//too long
			}
		}
	}

	updateHasGameEnded(){
		let is_check = this.isCheck(this.color_to_move);
		let is_there_a_legal_move = this.isThereALegalMoveFromPlayer(this.color_to_move); //this.getLegalMovesFromPlayer(this.color_to_move);//too long 35-145ms
		let is_checkmate = this.isCheckmate(is_there_a_legal_move, is_check);
		let is_stalemate = this.isStalemate(is_there_a_legal_move, is_check);
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
		let opponent_last_move = this.getLastMove();
		return isCheckFromBoard(this.board, color, this.kings_positions, opponent_last_move);
	}

	isCheckmate(is_there_legal_moves, is_check){
		return (!is_there_legal_moves && is_check);
	}

	isStalemate(is_there_legal_moves, is_check){
		return (!is_there_legal_moves && !is_check);
	}

	getLastMove(){
		return this.history.slice(-1)[0];
	}

	static buildFromHistory(deck_white, deck_black, history){
		let new_board = new Board(deck_white, deck_black);
		for(let move of history){
			new_board.makeMove(move)
		}
		return new_board;
	}
}

function isCheckFromBoard(
	board,
	color,
	kings_positions,
	opponent_last_move){
	let opponent_color = swapColor(color);
	for (let square = 0; square < 128; square++) {
		const piece = board[square]
		// If there's a piece on this square and this piece belongs to the player
		if (piece && piece.color === opponent_color){
			let piece_moves = piece.getLegalSquares(board, square, opponent_last_move);
			if (piece_moves.includes(kings_positions[color])) {
				return true;
			}
		}
	}
	return false;
}

function isMoveLegalFromBoard(board, kings_positions, move, opponent_last_move, piece) {
	let tmp_board = cloneDeep(board)
	let tmp_kings_positions = cloneDeep(kings_positions)
	tmp_board = tmp_board[move.from].move(move, tmp_board, opponent_last_move);
	// The king can escape
	if (piece.is_king){
		tmp_kings_positions[piece.color] = move.to;
	}
	// See if our opponent can capture our king after our move
	// The opponent can capture our king regardless of his king safety
	if (isCheckFromBoard(tmp_board, piece.color, tmp_kings_positions, move)) {
			return false;
	}
	return true;
}

function getLegalMovesFromPieceFromBoard(
	board,
	square,
	kings_positions,
	opponent_last_move,
	check_king_safety=true){
	// Get where the piece can go to
	let piece = board[square];
	let candidate_squares = piece.getLegalSquares(board, square, opponent_last_move);
	let legal_moves = []
	for (let candidate_square of candidate_squares){
		// Simulate the piece move
		let move = {
			'to': candidate_square,
			'from': square,
			'player_color': piece.color
		};
		// Check if this move put our king in danger
		if (check_king_safety){


			if (!isMoveLegalFromBoard(board, kings_positions, move, opponent_last_move, piece)){
				continue ;
			}
		}
		legal_moves.push(move);
	}
	return legal_moves;
}

function isThereALegalMoveFromPlayerFromBoard(//stop at the first move encounter
	board,
	color,
	kings_positions,
	opponent_last_move,
	check_king_safety=true){
	for (let square = 0; square < 128; square++) {
		const piece = board[square];
		// If there's a piece on this square and this piece belongs to the player
		if (piece && piece.color === color){
			let moves;
			moves = getLegalMovesFromPieceFromBoard(board, square, kings_positions, opponent_last_move, check_king_safety)
			if (moves && moves[0]){
				return true;
			}
		}
	}
	return false;
}

function getLegalMovesFromPlayerFromBoard(
	board,
	color,
	kings_positions,
	opponent_last_move,
	check_king_safety=true){
	let all_legal_moves = [];
	for (let square = 0; square < 128; square++) {
		const piece = board[square];
		// If there's a piece on this square and this piece belongs to the player
		if (piece && piece.color === color) {
			let piece_moves = getLegalMovesFromPieceFromBoard(board, square, kings_positions, opponent_last_move, check_king_safety)
			all_legal_moves = all_legal_moves.concat(piece_moves);
		}
	}
	return all_legal_moves;
}

export default Board
