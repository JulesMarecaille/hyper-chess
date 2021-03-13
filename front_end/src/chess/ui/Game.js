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
            selected_square: -1,
            highlighted_moves: [],
            game_over: false,
            winner: null,
            draw: null
        };
    }

    componentDidMount(){
        socket.on("opponentMove", (move) => {
            console.log(move)
            this.makeMove(move);
        });
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
                game_id: this.props.game_id,
                from: this.state.selected_square,
                to: square,
                player_color: this.state.boardObject.color_to_move
            };
            this.makeMove(move);
            socket.emit("makeMove", move);
        } else {
            // Reset click state
            this.setState({
                selected_square: -1,
                highlighted_moves: []
            });
        }
    }

    makeMove(move){
        let game_over, is_draw, winner = this.state.boardObject.makeMove(move);
        this.setState({
            selected_square: -1,
            highlighted_moves: [],
            game_over: game_over,
            is_draw: is_draw,
            winner: winner
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
                let is_check = (piece && piece.is_king && this.state.boardObject.is_check[piece.color]);
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.clickedSquare.bind(this)}
                            isSelected={is_selected}
                            isAnOption={is_an_option}
                            isClickable={is_clickable}
                            isCheck={is_check}
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
