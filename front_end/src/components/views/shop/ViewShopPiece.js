import React from 'react'
import { Helmet } from 'react-helmet'
import PieceImage from '../../chess/PieceImage'
import { BiCoin } from 'react-icons/bi'
import { Loader } from '../../navigation';
import { FaChessPawn, FaChessKing, FaChessQueen, FaChessRook, FaChessKnight, FaChessBishop } from 'react-icons/fa';
import { PIECE_MAPPING } from 'hyperchess_model/lib/pieces'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'
import Square from '../../chess/Square.js'
import BehaviorDisplay from './BehaviorDisplay.js'

class ViewShopPiece extends React.Component {
    constructor(props){
        super(props);
        this.board_len = 7;
        this.state={
            is_loading: false,
            piece_position : Math.floor((this.board_len * this.board_len) / 2)
        }
        this.board = new Array(this.board_len * this.board_len);
        this.board[this.state.piece_position] = this.props.piece;
    }

    handleBuy(){
        this.setState({
            is_loading: true
        })
        this.props.api.unlockPiece(this.props.piece.name).then(() => {
            this.props.onPieceBought();
            this.setState({
                is_loading: false
            })
        }).catch((err) => {});
    }

    drawPositions(){
        let positions = [];
        if (this.props.piece.hasStartingPosition("King")){
            positions.push(
                <span class="position"><FaChessKing/></span>
            )
        }
        if (this.props.piece.hasStartingPosition("Queen")){
            positions.push(
                <span class="position"><FaChessQueen/></span>
            )
        }
        if (this.props.piece.hasStartingPosition("Rook")){
            positions.push(
                <span class="position"><FaChessRook/></span>
            )
        }
        if (this.props.piece.hasStartingPosition("Bishop")){
            positions.push(
                <span class="position"><FaChessBishop/></span>
            )
        }
        if (this.props.piece.hasStartingPosition("Knight")){
            positions.push(
                <span class="position"><FaChessKnight/></span>
            )
        }
        if (this.props.piece.hasStartingPosition("Pawn")){
            positions.push(
                <span class="position"><FaChessPawn/></span>
            )
        }
        return positions;
    }

    voidFunction(){return null;}

    isTarget(behavior, i, j){
        if (!this.board[this.state.piece_position]) {return null;}
        let len = 16;
        let square = ((i + 3 + (4 - Math.floor(this.state.piece_position / this.board_len))) * len) + j + 3 + (4 - this.state.piece_position % this.board_len);
        let color = null;
        if (behavior[square] & 2){
            color = "red";
        }
        if (behavior[square] & 1){
            color = "black";
        }
        if (behavior[square] & 4){
            color = "green";
        }
        return (color);
    }

    makeMoveAnimation(square){
        if (this.isTarget(this.props.piece.behavior, Math.floor(square / this.board_len), square % this.board_len)){
            let move = {
                to : square,
                from : this.state.piece_position
            }
            this.setState({
                piece_position :square
            });
            this.props.piece.move(move, this.board, move)
        }
        //make a regular move on behavior board
    }

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

    render() {
        let content = <Loader/>
        if(!this.state.is_loading){
            let buy = '';
            if(!this.props.isOwned){
                if(this.props.user.coins < this.props.piece.cost){
                    buy = (
                        <div class="button disabled flat purchase-button">
                            Purchase ({this.props.piece.cost}<BiCoin className="icon"/>)
                        </div>
                    );
                } else {
                    buy = (
                        <div class="button gold purchase-button" onClick={this.handleBuy.bind(this)}>
                            Purchase ({this.props.piece.cost}<BiCoin className="icon"/>)
                        </div>
                    );
                }
            } else {
                buy = <div class="owned">Owned</div>
            }
            //console.log(new PIECE_MAPPING[this.props.piece.name](BLACK))
            content = (
                <div class="shop-piece-container">
                    <div class="main">
                        <div class="image">
                            <div class="piece white">
                                <PieceImage piece={this.props.piece}/>
                            </div>
                            <div class="piece black">
                                <PieceImage piece={new PIECE_MAPPING[this.props.piece.name](BLACK)}/>
                            </div>
                        </div>
                        <div class="name-positions">
                            <div class="name">{this.props.piece.label}<span class="value">({this.props.piece.value})</span></div>
                            <div class="positions">{this.drawPositions()}</div>
                        </div>
                        <div class="purchase">
                            {buy}
                        </div>
                    </div>
                    <div class="sub">
                        <div class="detail-container">
                            <div class="description">
                                {this.props.piece.description}
                            </div>
                            <BehaviorDisplay piece={this.props.piece}/>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="button" onClick={this.props.onReturn.bind(this, null)}>Back</div>
                    </div>
                </div>
            );
        }
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - {this.props.piece.label}</title>
            </Helmet>
            {content}
        </React.Fragment>)
    }
}

export default ViewShopPiece
