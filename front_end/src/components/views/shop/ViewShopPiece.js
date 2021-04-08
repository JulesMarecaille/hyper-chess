import React from 'react'
import PieceImage from '../../chess/PieceImage'
import { BiCoin } from 'react-icons/bi'
import { Loader } from '../../navigation';
import { FaChessPawn, FaChessKing, FaChessQueen, FaChessRook, FaChessKnight, FaChessBishop } from 'react-icons/fa';
import { PIECE_MAPPING } from 'hyperchess_model/lib/pieces'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'

class ViewShopPiece extends React.Component {
    constructor(props){
        super(props)
        this.state={
            is_loading: false
        }
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

    render() {
        let content = <Loader/>
        if(!this.state.is_loading){
            let buy = '';
            if(!this.props.isOwned){
                buy = (
                    <div class="purchase-button" onClick={this.handleBuy.bind(this)}>
                        <div class="text">Purchase</div>
                        <div class="cost">{this.props.piece.cost}<BiCoin className="icon"/></div>
                    </div>
                );
            } else {
                buy = <div class="owned">Owned</div>
            }
            console.log(new PIECE_MAPPING[this.props.piece.name](BLACK))
            content = (
                <div class="shop-piece-container">
                    <div class="main">
                        <div class="infos">
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
                        </div>
                        <div class="purchase">
                            {buy}
                        </div>
                    </div>
                    <div class="sub">
                        <div class="description">
                            {this.props.piece.description}
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
            {content}
        </React.Fragment>)
    }
}

export default ViewShopPiece
