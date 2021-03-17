import React from 'react'
import Board from '../model/Board'
import Square from './Square'
import './style.css'
import { WHITE, BLACK } from '../model/constants.js'
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
            highlighted_moves: [],
            game_over: false,
            winner: null,
            draw: null,
            is_check: false

        };
        this.blank_img =  new Image()
        this.move_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicMove.mp3");
        this.capture_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicCapture.mp3")
        this.check_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/ClassicCheck.mp3")
    }

    componentDidMount(){
        socket.on("opponentMove", (data) => {
            this.makeMove(data.move, data.time_remaining, false);
        });
    }

    componentWillUnmount(){
        socket.removeAllListeners("opponentMove");
    }

    // Events
    clickedSquare(square) {
        if (this.state.game_over){ return; }
        let piece = this.state.boardObject.board[square]
        if (this.state.selected_square !== square &&
            piece &&
            piece.color === this.state.boardObject.color_to_move &&
            piece.color === this.props.side &&
            !this.state.highlighted_moves.includes(square))
        {
            // Select player piece
            let legal_piece_moves = this.state.boardObject.getLegalMovesFromPiece(square);
            this.setState({
                selected_square: square,
                highlighted_moves: legal_piece_moves
            });
        } else if (this.state.selected_square !== -1 && this.state.highlighted_moves.includes(square)) {
            // Make move
            let move = {
                from: this.state.selected_square,
                to: square,
                player_color: this.state.boardObject.color_to_move
            };
            this.makeMove(move, null, true);
        } else {
            // Reset click state
            this.setState({
                selected_square: -1,
                highlighted_moves: []
            });
        }
    }

    dragPieceStart(evt, square){
        if (this.state.game_over){ return; }
        evt.dataTransfer.setDragImage(this.blank_img, 0, 0);
        let piece = this.state.boardObject.board[square]
        if (this.state.dragged_square === -1 &&
            piece &&
            piece.color === this.state.boardObject.color_to_move &&
            piece.color === this.props.side &&
            !this.state.highlighted_moves.includes(square))
        {
            // Select player piece
            let legal_piece_moves = this.state.boardObject.getLegalMovesFromPiece(square);
            this.setState({
                selected_square: square,
                dragged_square: square,
                dragged_element: evt.target,
                highlighted_moves: legal_piece_moves
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
        if (this.state.highlighted_moves.includes(square)) {
            // Make move
            let move = {
                from: this.state.selected_square,
                to: square,
                player_color: this.state.boardObject.color_to_move
            };
            this.makeMove(move, null, true);
        } else if (this.state.dragged_element !== -1) {
            this.state.dragged_element.style.position = "relative";
            this.state.dragged_element.style.left = 0;
            this.state.dragged_element.style.top = 0;
            this.state.dragged_element.style.pointerEvents = "auto";
        }
        this.setState({
            dragged_square: -1,
            dragged_element: null
        });
    }

    dragOverSquare(square){
        this.setState({
            mouse_over_square: square
        });
    }

    // Action
    makeMove(move, time_remaining=null, emit=false){
        let {game_over, is_draw, winner, is_capture, is_check} = this.state.boardObject.makeMove(move);
        if (is_check){
            this.check_sound.play()
        } else if(is_capture){
            this.capture_sound.play()
        } else {
            this.move_sound.play();
        }
        if(emit){
            let payload = {
                game_id: this.props.game_id,
                move: move,
                is_game_over: game_over,
                winner: winner
            }
            socket.emit("makeMove", payload);
        }
        this.props.onPlayerMoved(time_remaining)
        this.setState({
            selected_square: -1,
            highlighted_moves: [],
            game_over: game_over,
            is_draw: is_draw,
            winner: winner,
            is_check: is_check
        });
        if (this.state.game_over){
            this.props.onGameOver(winner);
        }
    }

    // Rendering
    drawChessBoard() {
        let chessboard = [];
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let tmp_i = 0; tmp_i < 8; tmp_i += 1) {
            let i = (this.props.side === BLACK ? 7 - tmp_i : tmp_i);
            let row = [];
            row.push(<th className="outer">{8 - i}</th>)
            for (let tmp_j = 0; tmp_j < 8; tmp_j += 1) {
                let j = (this.props.side === BLACK ? 7 - tmp_j : tmp_j);
                let square = ((i * 16) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let piece = this.state.boardObject.board[square];
                let is_an_option = this.state.highlighted_moves.includes(square);
                let is_selected = this.state.selected_square === square;
                // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
                let is_clickable = (is_an_option || (piece && (piece.color === this.state.boardObject.color_to_move)));
                let is_check = (piece && piece.is_king && this.state.is_check && piece.color === this.state.boardObject.color_to_move);
                let is_draggable = (piece && (piece.color === this.props.side))
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
                            isAnOption={is_an_option}
                            isClickable={is_clickable}
                            isCheck={is_check}
                            isDraggable={is_draggable}
                    />);
            }
            files.push(<th className="outer">{files_label[i]}</th>)
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return chessboard;
    }

    render() {
        return (
        <React.Fragment>
        <div>
            <table className="chess-board">
                {this.drawChessBoard()}
            </table>
        </div>
        </React.Fragment>)
    }
}

export default Game
