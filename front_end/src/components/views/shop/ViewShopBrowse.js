import React from 'react'
import DailyReward from './DailyReward'
import Piece from '../../../chess/ui/Piece'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FaChessPawn, FaChessKing, FaChessQueen, FaChessRook, FaChessKnight, FaChessBishop } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi'
import { MdSearch, MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'
import { PIECE_MAPPING} from '../../../chess/model/pieces/index'
import { WHITE, BLACK } from '../../../chess/model/constants.js'

class ViewShopBrowse extends React.Component {
    constructor(props){
        super(props)
        this.state={
            filter_search: "",
            filter_position: "",
            filter_owned_only: false,
            filter_not_owned_only: false
        }
    }

    handleTextTyped(evt){
        this.setState({
            filter_search: evt.target.value
        });
    }

    handleToggleFilterPosition(position){
        let filter_position = this.state.filter_position;
        if(filter_position === position){
            filter_position = "";
        } else {
            filter_position = position;
        }
        this.setState({
            filter_position: filter_position
        })
    }

    handleToggleOwnedOnlyFilter(){
        this.setState({
            filter_owned_only: !this.state.filter_owned_only,
            filter_not_owned_only: false
        })
    }

    handleToggleNotOwnedOnlyFilter(){
        this.setState({
            filter_owned_only: false,
            filter_not_owned_only: !this.state.filter_not_owned_only
        })
    }

    drawAllPieces(){
        let all_pieces = [];
        for(let [piece_name, is_piece_bought] of Object.entries(this.props.collection)){
            let piece_white = new PIECE_MAPPING[piece_name](WHITE);
            let piece_black = new PIECE_MAPPING[piece_name](BLACK);
            let cost;

            // Filter search field
            if(!piece_name.toUpperCase().includes(this.state.filter_search.toUpperCase())){
                continue;
            }

            // Fitler positions
            if(this.state.filter_position !== "" && !piece_white.hasStartingPosition(this.state.filter_position)){
                continue;
            }

            // Filter owned
            if((this.state.filter_owned_only && !is_piece_bought) || (this.state.filter_not_owned_only && is_piece_bought)){
                continue;
            }

            if(!is_piece_bought){
                cost = <div class="cost">{piece_white.cost}<BiCoin className="icon"/></div>
            } else {
                cost = <div class="owned">Owned</div>
            }
            all_pieces.push(
                <div class="piece-entry" onClick={this.props.onSelectedPiece.bind(this, piece_white)}>
                    <div class="piece white"><Piece piece={piece_white}/> </div>
                    <div class="piece black"><Piece piece={piece_black}/></div>
                    <div class="name">{piece_white.label}<span class="value">({piece_white.value})</span></div>
                    {cost}
                </div>
            )
        }
        return all_pieces;
    }

    drawFilters(){
        // Positions
        let positions_filters = {
            "King": <FaChessKing/>,
            "Queen": <FaChessQueen/>,
            "Rook": <FaChessRook/>,
            "Bishop": <FaChessBishop/>,
            "Knight": <FaChessKnight/>,
            "Pawn": <FaChessPawn/>
        }
        let positions_filters_elements = [];
        for(let [position_name, position_icon] of Object.entries(positions_filters)){
            let is_selected = this.state.filter_position === position_name ? "" : "unselected";
            positions_filters_elements.push(
                <span class={`position ${is_selected}`} onClick={this.handleToggleFilterPosition.bind(this, position_name)}>{position_icon}</span>
            );
        }
        return (
            <div class="filters-container">
                <div class="searchbar-container">
                    <input class="searchbar" type="text" onChange={this.handleTextTyped.bind(this)} placeholder="Search..."></input>
                </div>
                <div class="position-filters">
                    <span class="title">Filter by position</span>
                    <div class="positions-container">
                        {positions_filters_elements}
                    </div>
                </div>
                <div class="owned-filters">
                    <span class="title">Filter by possesion</span>
                    <div class="filters">
                        <div class={`filter ${this.state.filter_owned_only ? "selected" : "unselected"}`}
                             onClick={this.handleToggleOwnedOnlyFilter.bind(this)}>
                            <MdRadioButtonChecked class="icon checked"/>
                            <MdRadioButtonUnchecked class="icon unchecked"/>
                            <span>Owned only</span>
                        </div>
                        <div class={`filter ${this.state.filter_not_owned_only ? "selected" : "unselected"}`}
                             onClick={this.handleToggleNotOwnedOnlyFilter.bind(this)}>
                             <MdRadioButtonChecked class="icon checked"/>
                             <MdRadioButtonUnchecked class="icon unchecked"/>
                            <span>Not owned only</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
        <React.Fragment>
            <div className="shop-browse-container">
                <div class="left-panel view-padding">
                    <DailyReward api={this.props.api}
                                 user={this.props.user}
                                 onUpdateUser={this.props.onUpdateUser}/>
                    {this.drawFilters()}
                </div>
                <PerfectScrollbar className="pieces-container view-padding">
                    {this.drawAllPieces()}
                </PerfectScrollbar>
            </div>
        </React.Fragment>)
    }
}

export default ViewShopBrowse
