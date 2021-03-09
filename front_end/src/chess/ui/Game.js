import React from 'react'
import Board from '../model/Board'
import { WHITE, BLACK, swapColor } from '../model/constants.js'
import Square from './Square'
import './style.css'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardObject: new Board(null, null),
            player_to_move: WHITE,
            dragged_square: null,
            selected_square: -1,
            highlighted_moves: []
        };
    }

    // Events
    clickedSquare(square) {
        let piece = this.state.boardObject.board[square]
        if (this.state.selected_square === -1 && piece && piece.color === this.state.player_to_move){
            // Select player piece
            let legal_piece_moves = this.state.boardObject.getLegalMovesFromPiece(piece, square);
            this.setState({
                selected_square: square,
                highlighted_moves: legal_piece_moves
            });
        } else if (this.state.selected_square !== -1 && this.state.highlighted_moves.includes(square)) {
            // Make move
            let move = {
                from: this.state.selected_square,
                to: square,
                player: this.state.player_to_move
            };
            this.state.boardObject.makeMove(move);
            this.setState({
                selected_square: -1,
                highlighted_moves: [],
                player_to_move: swapColor(this.state.player_to_move)
            });
        } else {
            // Reset click state
            this.setState({
                selected_square: -1,
                highlighted_moves: []
            });
        }
    }

    // Rendering
    drawChessBoard() {
        let chessboard = [];
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let i = 0; i < 8; i++) {
            let row = [];
            row.push(<th className="outer">{8 - i}</th>)
            for (let j = 0; j < 8; j++) {
                let square = ((i * 16) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let piece = this.state.boardObject.board[square];
                let is_an_option = this.state.highlighted_moves.includes(square);
                let is_selected = this.state.selected_square === square;
                // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
                let is_clickable = (is_an_option || (piece && (piece.color === this.state.player_to_move)));
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.clickedSquare.bind(this)}
                            isSelected={is_selected}
                            isAnOption={is_an_option}
                            isClickable={is_clickable}
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
        <table className="chess-board">
            {this.drawChessBoard()}
        </table>
        </React.Fragment>)
    }
}

export default Game
