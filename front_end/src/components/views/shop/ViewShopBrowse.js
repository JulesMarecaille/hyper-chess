import React from 'react'
import DailyReward from './DailyReward'
import PieceDraw from '../../../chess/ui/PieceDraw'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BiCoin } from 'react-icons/bi'
import { PIECE_MAPPING} from '../../../chess/model/pieces/index'
import { WHITE, BLACK } from '../../../chess/model/constants.js'

class ViewShopBrowse extends React.Component {
    constructor(props){
        super(props)
        this.state={

        }
    }

    drawAllPieces(){
        let all_pieces = [];
        for(let [piece_name, is_piece_bought] of Object.entries(this.props.collection)){
            let piece_white = new PIECE_MAPPING[piece_name](WHITE);
            let piece_black = new PIECE_MAPPING[piece_name](BLACK);
            let cost;
            if(!is_piece_bought){
                cost = <div class="cost">{piece_white.cost}<BiCoin className="icon"/></div>
            } else {
                cost = <div class="owned">Owned</div>
            }
            all_pieces.push(
                <div class="piece-entry" onClick={this.props.onSelectedPiece.bind(this, piece_white)}>
                    <div class="piece white">{piece_white.draw}</div>
                    <div class="piece black">{piece_white.draw_display_number}{piece_black.draw}</div>
                    <div class="name">{piece_white.label}<span class="value">({piece_white.value})</span></div>
                    {cost}
                </div>
            )
        }
        return all_pieces;
    }

    render() {
        return (
        <React.Fragment>
            <div className="shop-browse-container">
                <div class="left-panel view-padding">
                    <DailyReward api={this.props.api}
                                 user={this.props.user}
                                 onUpdateUser={this.props.onUpdateUser}/>
                </div>
                <PerfectScrollbar className="pieces-container view-padding">
                    {this.drawAllPieces()}
                </PerfectScrollbar>
            </div>
        </React.Fragment>)
    }
}

export default ViewShopBrowse
