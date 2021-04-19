import React from 'react'
import Square from '../../chess/Square.js'
import { PIECE_MAPPING } from 'hyperchess_model/lib/pieces'

class BehaviorDisplay extends React.Component {
    constructor(props){
        super(props);
        this.board_width = 7; //modify to rescale
        this.state={
            is_loading: false,
            piece_position : Math.floor(this.board_width / 2) * this.board_width * 2 + Math.floor(this.board_width / 2)
        }
        this.board = new Array(this.board_width * this.board_width * 2);
        this.board[this.state.piece_position] = this.props.piece;
        this.piece = this.props.piece;
    }

    voidFunction(){return null;}

    drawBehavior(piece){
        let chessboard = [];
        let files = [];
        for (let i = 0; i < this.board_width; i += 1) {
            let row = [];
            for (let j = 0; j < this.board_width; j += 1) {
                let square = ((i * this.board_width * 2) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let piece_now = this.board[square];
                let option_marker_color = this.isTarget(piece.behavior, i, j);
                let is_an_option = option_marker_color ? true : false;
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece_now}
                            onClick={this.makeMoveAnimation.bind(this)}
                            isSelected={false}
                            isAnOption={is_an_option}
                            dragStart={this.voidFunction.bind(this)}
                            dragging={this.voidFunction.bind(this)}
                            dragEnd={this.voidFunction.bind(this)}
                            dragOver={this.voidFunction.bind(this)}
                            optionMarkerColor={option_marker_color}
                            isClickable={false}
                            isCheck={false}
                            isDraggable={false}
                            isPremove={false}
                            key={square}
                    />);
            }
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return (<div className="chessboard-container"><table className="chess-board">{chessboard}</table></div>);
    }

    makeMoveAnimation(square){
        if (this.isTarget(this.piece.behavior, Math.floor(square / (this.board_width * 2)), square % this.board_width)){
            let move = {
                to : square,
                from : this.state.piece_position
            }
            this.setState({
                piece_position :square
            });
            this.piece.move(move, this.board, move)
        } else if (this.board[square]) {
            this.piece = this.board[square];
            this.setState({
                piece_position :square
            });
        }
    }

    isTarget(behavior, i, j){
        if (!this.board[this.state.piece_position]) {return null;}
        let behavior_len = 16;
        let behavior_index = ((i + 3 + (4 - Math.floor(this.state.piece_position / (this.board_width * 2)))) * behavior_len) + j + 3 + (4 - this.state.piece_position % this.board_width);
        let color = "";
        if (behavior[behavior_index] & 2){
            color += "red";
        }
        if (behavior[behavior_index] & 1){
            if (color){color += " "}
            color += "green";
        }
        if (behavior[behavior_index] & 4){
            if (color){color += " "}
            color += "yellow";
        }
        if (behavior[behavior_index] & 16){
            if (this.piece.isSpecialPossible(this.board, i * this.board_width * 2 + j, this.state.piece_position)){
                if (color){color += " "}
                color += "blue";
            }
        }
        return (color);
    }

    drawSquareOptionColor(color_option, color){
        return (
            <Square square={0}
                color={color}
                piece={null}
                onClick={this.voidFunction.bind(this)}
                isSelected={false}
                isAnOption={true}
                dragStart={this.voidFunction.bind(this)}
                dragging={this.voidFunction.bind(this)}
                dragEnd={this.voidFunction.bind(this)}
                dragOver={this.voidFunction.bind(this)}
                optionMarkerColor={color_option}
                isClickable={false}
                isCheck={false}
                isDraggable={false}
                isPremove={false}
                key={0}
            />
        );
    }

    drawLegend(){
        return (
            <div className="chessboard-container"><table className="chess-board">
                <tr>{this.drawSquareOptionColor("green", "dark")}<span className="comment">Can move on square</span></tr>
                <tr>{this.drawSquareOptionColor("red", "light")}<span className="comment">Can attack on square</span></tr>
                <tr>{this.drawSquareOptionColor("yellow", "dark")}<span className="comment">Doesn't need a line of sight</span></tr>
                <tr>{this.drawSquareOptionColor("blue", "light")}<span className="comment">Do a special action</span></tr>
            </table></div>
        );
    }

    render() {
        if (!this.props.piece) {return ;}
        return (
        <React.Fragment>
            <div className="display-behavior">
                {this.drawBehavior(this.props.piece)}
                {this.drawLegend()}
            </div>
        </React.Fragment>);
    }
}

export default BehaviorDisplay;
