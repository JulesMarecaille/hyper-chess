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
		this.hash_map = new Map();
		this.game_events = {};
		this.hash_id_max = 1;
		this.nb_moves_rule = 0;
		this.last_hash = null;//will be set in initialize board
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
		this.game_events = getDefaultGameEvents();
		this.hash_id_max = 1;//1 is used for empty squares 0 is for End of string
		this.nb_moves_rule = 0;
		this.updateHashMap();//add the initial board to the hash map
	}

	customHash(){
		let hash_result = "";
		for (let i = 0; i < this.board.length; i++){
			if (i % 16 < 8){
				let piece = this.board[i];
				if (piece){
					if (piece.hash_id === ""){//if the piece still doesn't have an unique id, set one
						piece.hash_id = String.fromCharCode(this.hash_id_max);
						this.hash_id_max++;
					}
					hash_result += piece.hash_id;
				} else {
					hash_result += String.fromCharCode(1);
				}
			}
		}
		return hash_result;
	}

	updatePieces(move_result){
		let square = 0;
		let board = move_result.board;
		for (let piece of board){
			if (piece) {
				move_result = piece.updateStatusFromBoard(board, square, move_result.game_events, move_result.nbr_captures);
			}
			square++;
		}
		return move_result;
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
		// Move the piece
		let move_result = this.board[move.from].move(move, this.board, this.getLastMove(), this.game_events);
		move_result = this.updatePieces(move_result);
		this.board = move_result.board;
		this.game_events = move_result.game_events;
		let nb_captures = move_result.nb_captures;
		this.updateHistory(move);
		this.updateHashMap();
		this.update50MoveRule(nb_captures, move);
		this.updateKingPosition();
		// Change turn
		this.color_to_move = swapColor(this.color_to_move);
		let is_check = this.is_check[this.color_to_move];
		let end_game_message = this.updateHasGameEnded();
		let game_over = this.game_over;
		let is_draw = this.is_draw;
		let winner = this.winner;
		let is_capture = (nb_captures >= 1);
		let pack = {game_over, is_draw, winner, is_capture, is_check, end_game_message};
		// Events
		if(is_check){
			this.game_events[swapColor(this.color_to_move)]["GiveCheck"] += 1;
		}
		this.game_events[swapColor(this.color_to_move)]["CapturePiece"] += nb_captures;
		return pack;
	}

	updateHistory(move){
		this.history.push(move);
	}

	updateHashMap(){
		this.last_hash = this.customHash();
		let new_repetition = 1;
		if (this.hash_map.has(this.last_hash)){
			new_repetition += this.hash_map.get(this.last_hash).repetition;
		}
		this.hash_map.set(this.last_hash, {repetition : new_repetition})
	}

	update50MoveRule(nb_captures, move){
		if (nb_captures >= 1
			|| (this.board[move.to] && this.board[move.to].can_promote))
		{
			this.nb_moves_rule = 0;
		} else {
			this.nb_moves_rule++;
		}
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

	isThereRepetitionDraw(){
		return (this.hash_map.get(this.last_hash).repetition > 2);
	}

	isThere50MoveDraw(){
		if (this.nb_moves_rule >= 50){ return true; }
		return false;
	}

	isThereDeadPositionDraw(){
		let black_side_sum = 0;
		let white_side_sum = 0;
		this.board.forEach((piece, i) => {
			if (piece){
				if (piece.color === BLACK){
					black_side_sum += piece.mate_strength;
				} else if (piece.color === WHITE){
					white_side_sum += piece.mate_strength;
				}
			}
		});
		if (black_side_sum < 3 && white_side_sum < 3) { return true; }
		return false;
	}

	updateHasGameEnded(){
		let is_check = this.isCheck(this.color_to_move);
		let is_there_a_legal_move = this.isThereALegalMoveFromPlayer(this.color_to_move);
		let is_checkmate = !is_there_a_legal_move && is_check;
		let is_stalemate = !is_there_a_legal_move && !is_check;
		let is_repetition_draw = this.isThereRepetitionDraw();
		let is_50_move_draw = this.isThere50MoveDraw();
		let is_dead_position_draw = this.isThereDeadPositionDraw();
		if (is_checkmate || is_stalemate || is_repetition_draw || is_50_move_draw || is_dead_position_draw){
			this.game_over = true
			if (is_checkmate){
				// The winner made the last move
				this.winner = swapColor(this.color_to_move);
				this.game_events[this.winner]["GiveCheckmate"] += 1;
				return "By checkmate.";
			} else {
				this.is_draw = true;
				if (is_repetition_draw) {
					return "By repetition.";
				} else if (is_stalemate){
					return "By stalemate.";
				} else if (is_50_move_draw){
					return "By 50-Move Rule.";
				} else {
					return "By dead position.";
				}
			}
		}
		return "";
	}

	isCheck(color){
		let opponent_last_move = this.getLastMove();
		return isCheckFromBoard(this.board, color, this.kings_positions, opponent_last_move);
	}

	getLastMove(){
		return this.history.slice(-1)[0];
	}

	getEvents(){
		return this.game_events;
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
			let piece_moves = piece.getLegalCheckSquares(board, square, opponent_last_move);
			if (piece_moves.includes(kings_positions[color])) {
				return true;
			}
		}
	}
	return false;
}

function isMoveStillLegalFromBoard(board, kings_positions, move, opponent_last_move, piece){
	let tmp_board = cloneDeep(board)
	let tmp_kings_positions = cloneDeep(kings_positions)
	let move_result = tmp_board[move.from].move(move, tmp_board, opponent_last_move, getDefaultGameEvents());
	tmp_board = move_result.board;
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

function isMoveLegalFromBoard(board, kings_positions, move, opponent_last_move, piece) {
	if (!board[move.from]){
		return false;
	}
	let legal_moves =  getLegalMovesFromPieceFromBoard(board, move.from, kings_positions, opponent_last_move, true);
	if (!legal_moves.map(x => x.to).includes(move.to)){
		return false;
	}
	return isMoveStillLegalFromBoard(board, kings_positions, move, opponent_last_move, piece);
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
			if (!isMoveStillLegalFromBoard(board, kings_positions, move, opponent_last_move, piece)){
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
			if (moves && moves.length > 0){
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

export function getDefaultGameEvents(){
	let game_events = {}
	let default_events = {
		"PlayGame": 1,
		"GiveCheck": 0,
		"CapturePiece": 0,
		"PromotePawn": 0,
		"GiveCheckmate": 0
	}
	game_events[WHITE] = {...default_events}
	game_events[BLACK] = {...default_events}
	return game_events
}

export default Board
