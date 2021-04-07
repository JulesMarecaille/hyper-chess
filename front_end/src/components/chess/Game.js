import React from 'react'
import {Board} from 'hyperchess_model/lib'
import Square from './Square'
import Piece from './Piece'
import { PIECE_MAPPING } from 'hyperchess_model/lib/pieces'
import './style.css'
import { BLACK } from 'hyperchess_model/lib/constants'
import { socket } from '../../connection/socket';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardObject: new Board(this.props.whiteDeck, this.props.blackDeck),
            dragged_square: -1,
            dragged_element: null,
            selected_square: -1,
            mouse_over_square: -1,
            highlighted_squares: [],
            opponent_highlighted_squares: [],
            game_over: false,
            winner: null,
            draw: null,
            is_check: false,
            options_selection:[],
            premove: null
        };
        this.user_have_to_select = false; //need to be out of state for instant execution
        this.blank_img =  new Image()
        this.move_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicMove.mp3");
        this.capture_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicCapture.mp3")
        this.check_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicCheck.mp3")
    }

    componentDidMount(){
        socket.on("opponentMove", (data) => {
            this.makeMove(data.move, data.time_remaining, false);
            if(this.state.premove){
                if(this.state.boardObject.isMoveLegal(this.state.premove)){
                    this.makeMove(this.state.premove, null, true);
                }
                this.setState({
                    premove: null
                })
            }
        });

        if(this.props.reconnectionData){
            let board_object = Board.buildFromHistory(this.props.whiteDeck, this.props.blackDeck, this.props.reconnectionData.history)
            this.setState({
                boardObject: board_object,
                selected_square: -1,
                highlighted_squares: [],
                opponent_highlighted_squares: [],
                game_over: board_object.game_over,
                is_draw: board_object.is_draw,
                winner: board_object.winner,
                is_check: board_object.is_check[board_object.color_to_move]
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.side !== this.props.side) {
            this.setState({
                boardObject: new Board(this.props.whiteDeck, this.props.blackDeck),
                dragged_square: -1,
                dragged_element: null,
                selected_square: -1,
                mouse_over_square: -1,
                highlighted_squares: [],
                opponent_highlighted_squares: [],
                game_over: false,
                winner: null,
                draw: null,
                is_check: false,
                options_selection:[],
                premove: null
            });
            this.user_have_to_select = false;
        }
    }

    componentWillUnmount(){
        socket.removeAllListeners("opponentMove");
    }

    // Events
    clickedSquare(square) {
        if (this.state.game_over){ return; }
        let piece = this.state.boardObject.board[square];
        if (this.state.selected_square !== square
            && piece
            && !this.state.highlighted_squares.includes(square))
        {
            let legal_piece_moves = this.state.boardObject.getLegalMovesFromPiece(square).map(x => x.to);
            if(piece.color === this.props.side){
                // Select player piece
                this.setState({
                    selected_square: square,
                    highlighted_squares: legal_piece_moves,
                    opponent_highlighted_squares: []
                });
            } else {
                // Select opponent piece
                this.setState({
                    highlighted_squares: [],
                    opponent_highlighted_squares: legal_piece_moves
                });
            }
        } else if ( this.state.selected_square !== -1
                    && this.state.highlighted_squares.includes(square))
        {
            // Make move
            let options;
            let move = {
                from: this.state.selected_square,
                to: square,
                player_color: this.props.side
            };
            options = this.state.boardObject.getAction(move);
            if (options){//si la pièce à besoin de faire une action particulière, nécessitant de l'ui
                this.askUserForAChoice(move, options);
            } else {
                if(this.props.side === this.state.boardObject.color_to_move){
                    this.makeMove(move, null, true);
                } else {
                    this.setState({
                        premove: move,
                        selected_square: -1,
                        highlighted_squares: [],
                        opponent_highlighted_squares: [],
                    });
                }
            }
        } else {
            // Reset click state
            this.setState({
                selected_square: -1,
                highlighted_squares: [],
                opponent_highlighted_squares: [],
                premove: null
            });
        }
    }

    dragPieceStart(evt, square){
        if (this.state.game_over){ return; }
        evt.dataTransfer.setDragImage(this.blank_img, 0, 0);
        let piece = this.state.boardObject.board[square];
        if (this.state.dragged_square === -1
            && piece
            && piece.color === this.props.side
            && !this.state.highlighted_squares.includes(square))
        {
            // Select player piece
            let legal_piece_moves = this.state.boardObject.getLegalMovesFromPiece(square).map(x => x.to);
            this.setState({
                selected_square: square,
                dragged_square: square,
                dragged_element: evt.target,
                highlighted_squares: legal_piece_moves,
                opponent_highlighted_squares: [],
                premove: null
            });
        } else {
            evt.preventDefault();
        }
    }

    draggingPiece(evt){
        let element = evt.target;
        let parent = element.parentElement.getBoundingClientRect()
        let mouse_x = Math.round(evt.clientX - parent.x - (element.clientWidth/2));
        let mouse_y = Math.round(evt.clientY - parent.y - (element.clientHeight/2));
        element.style.position = "absolute";
        element.style.left = `${mouse_x}px`;
        element.style.top = `${mouse_y}px`;
        element.style.pointerEvents = "none";
    }

    dragPieceEnd(){
        let square = this.state.mouse_over_square;
        // Make move
        let move = {
            from: this.state.selected_square,
            to: square,
            player_color: this.props.side
        };
        let options = null;
        if(this.props.side !== this.state.boardObject.color_to_move){
            options = this.state.boardObject.getAction(move);
            if (options){
                this.askUserForAChoice(move, options);
            } else {
                this.setState({
                    premove: move,
                    selected_square: -1,
                    highlighted_squares: [],
                    opponent_highlighted_squares: []
                })
            }
        }
        if (this.state.highlighted_squares.includes(square)
            && this.props.side === this.state.boardObject.color_to_move)
        {
            options = this.state.boardObject.getAction(move)
            if (options){
                this.askUserForAChoice(move, options);
            } else {
                this.makeMove(move, null, true);
            }
        } else if (!options) {
            this.resetDraggedPiece();
        }
        if (!options){
            this.setState({
                dragged_square: -1,
                dragged_element: null,
            });
        }
    }

    resetDraggedPiece()
    {
        if (this.state.dragged_element !== -1
            && this.state.dragged_element
            && this.state.dragged_element.style)
        {
            this.state.dragged_element.style.position = "relative";
            this.state.dragged_element.style.left = 0;
            this.state.dragged_element.style.top = 0;
            this.state.dragged_element.style.pointerEvents = "auto";
        }
    }

    dragOverSquare(square){
        this.setState({
            mouse_over_square: square
        });
    }

    // Action
    makeMove(move, time_remaining=null, emit=false){
        let boardResponse;
        if(this.state.boardObject.color_to_move !== move.player_color){ return; }
        boardResponse = this.state.boardObject.makeMove(move)
        if (boardResponse.is_check){
            this.check_sound.play()
        } else if(boardResponse.is_capture){
            this.capture_sound.play()
        } else {
            this.move_sound.play();
        }
        if(emit){
            let payload = {
                game_id: this.props.game_id,
                move: move,
                is_game_over: boardResponse.game_over,
                winner: boardResponse.winner
            }
            socket.emit("makeMove", payload);
        }
        this.props.onPlayerMoved(time_remaining)
        this.setState({
            selected_square: -1,
            highlighted_squares: [],
            opponent_highlighted_squares: [],
            game_over: boardResponse.game_over,
            is_draw: boardResponse.is_draw,
            winner: boardResponse.winner,
            is_check: boardResponse.is_check
        });
        if (this.state.game_over){
            this.props.onGameOver(boardResponse.winner);
        }
    }

    // Rendering
    drawChessBoard() {
        let chessboard = [];
        let last_move = this.state.boardObject.getLastMove();
        let last_move_squares = [];
        if(last_move){
            last_move_squares = [last_move.from, last_move.to];
        }
        let premove_squares = [];
        if(this.state.premove){
            premove_squares = [this.state.premove.from, this.state.premove.to];
        }
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let tmp_i = 0; tmp_i < 8; tmp_i += 1) {
            let i = (this.props.side === BLACK ? 7 - tmp_i : tmp_i);
            let row = [];
            row.push(<th className="outer unselectable">{8 - i}</th>)
            for (let tmp_j = 0; tmp_j < 8; tmp_j += 1) {
                let j = (this.props.side === BLACK ? 7 - tmp_j : tmp_j);
                let square = ((i * 16) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let piece = this.state.boardObject.board[square];
                let is_an_option = (this.state.highlighted_squares.includes(square) || this.state.opponent_highlighted_squares.includes(square));
                let is_selected = (this.state.selected_square === square);
                let is_last_move = (last_move_squares.includes(square))
                // The square can be clicked if it's a move option or if there's a piece on it
                let is_clickable = (this.state.highlighted_squares.includes(square) || (piece));
                let is_check = (piece && piece.is_king && this.state.is_check && piece.color === this.state.boardObject.color_to_move);
                let is_draggable = (piece && (piece.color === this.props.side))
                let is_premove = (premove_squares.includes(square));
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.clickedSquare.bind(this)}
                            dragStart={this.dragPieceStart.bind(this)}
                            dragging={this.draggingPiece.bind(this)}
                            dragEnd={this.dragPieceEnd.bind(this)}
                            dragOver={this.dragOverSquare.bind(this)}
                            isSelected={is_selected}
                            isLastMove={is_last_move}
                            isAnOption={is_an_option}
                            isClickable={is_clickable}
                            isCheck={is_check}
                            isDraggable={is_draggable}
                            isPremove={is_premove}
                    />);
            }
            files.push(<th className="outer unselectable">{files_label[i]}</th>)
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return chessboard;
    }

    askUserForAChoice(move, options_selection){
        this.user_have_to_select = true;
        this.setState({
            options_selection: options_selection,
            pending_move:move
        });
    }

    overlaySelection(selection){
        this.user_have_to_select = false;
        let new_move = this.state.boardObject.makeAction(this.state.pending_move, selection);
        if(this.props.side === this.state.boardObject.color_to_move){
            this.makeMove(new_move, null, true);
        } else {
            this.setState({
                premove: new_move,
                selected_square: -1,
                highlighted_squares: [],
                opponent_highlighted_squares: [],
            });
        }
        this.setState({
            dragged_square: -1,
            dragged_element: null,
            pending_move: null,
        });
        this.resetDraggedPiece();
    }

    closeTheOverlay(){
        if (this.user_have_to_select){
            this.user_have_to_select = false;
            this.resetDraggedPiece();
            this.setState({
                pending_move: null,
                dragged_square: -1,
                dragged_element: null
            })
        }
    }

    drawOptionsOfOverlay(list_of_options)
    {
        let options = [];
        list_of_options.forEach((item, i) => {
            let piece = new PIECE_MAPPING[item](this.props.side);
            options.push(<div className="piece-container">
                            <div className="img-overlay" onClick={this.overlaySelection.bind(this, item)}>
                                <Piece piece={piece}/>
                            </div>
                        </div>);
        });
        return options;
    }

    drawOverlaySelection(){
        if (this.user_have_to_select){
                let overlayPannel = this.drawOptionsOfOverlay(this.state.options_selection);
                return (
                    <div className="overlay-options-selection"
                        onClick={this.closeTheOverlay.bind(this)}>
                        <div class="box">
                            {overlayPannel}
                        </div>
                    </div>);
        } else {
            return ("");
        }
    }

    render() {
        let overlay = this.drawOverlaySelection();
        return (
        <React.Fragment>
        <div className="chessboard-container">
            <table className="chess-board">
                {this.drawChessBoard()}
            </table>
            {overlay}
        </div>
        </React.Fragment>);
    }
}

export default Game
