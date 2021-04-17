import React from 'react'
import Square from '../../chess/Square.js'

class BehaviorDisplay extends React.Component {
    constructor(props){
        super(props);
        this.board_len = 7; //modify to rescale
        this.state={
            is_loading: false,
            piece_position : Math.floor(this.board_len / 2) * this.board_len + Math.floor(this.board_len / 2)
        }
        this.board = new Array(this.board_len * this.board_len);
        this.board[this.state.piece_position] = this.props.piece;
        this.piece = this.props.piece;
    }

    voidFunction(){return null;}

    drawBehavior(piece){
        let chessboard = [];
        let files = [];
        for (let i = 0; i < this.board_len; i += 1) {
            let row = [];
            for (let j = 0; j < this.board_len; j += 1) {
                let square = ((i * this.board_len) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let piece_now = this.board[square];//square === this.state.piece_position ? piece : null;
                let option_marker_color = this.isTarget(piece.behavior, i, j);//put ti true to make orange, if behavior trad true
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
        if (this.isTarget(this.piece.behavior, Math.floor(square / this.board_len), square % this.board_len)){
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
        let len = 16;
        let square = ((i + 3 + (4 - Math.floor(this.state.piece_position / this.board_len))) * len) + j + 3 + (4 - this.state.piece_position % this.board_len);
        let color = null;
        if (behavior[square] & 2){
            color = "red";
            if (behavior[square] & 1){
                color = "black";
            }
        } else if (behavior[square] & 1){
            color = "blue";
        }
        if (behavior[square] & 4){
            color = "green";
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
                <tr>{this.drawSquareOptionColor("blue", "dark")}<span className="comment">Can only move</span></tr>
                <tr>{this.drawSquareOptionColor("red", "light")}<span className="comment">Can only attack</span></tr>
                <tr>{this.drawSquareOptionColor("black", "dark")}<span className="comment">Can move and attack</span></tr>
                <tr>{this.drawSquareOptionColor("green", "light")}<span className="comment">Can Jump</span></tr>
            </table></div>
        );
    }

    render() {
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
