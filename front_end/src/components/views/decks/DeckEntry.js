import React from 'react'
import { Square } from '../../chess'
// import '../../chess/ui/style.css'
import { PIECE_MAPPING} from 'hyperchess_model/lib/pieces'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'

class DeckEntry extends React.Component {
    constructor(props) {
        super(props);
        this.deck = props.deck;
        this.state = {
            selected_square: -1,
            clicked_name: false,
            name: null,
            valid_piece_positions: this.props.valid_piece_positions
        }
    }

    handleClick(evt){
        if (this.props.onClick){
            this.props.onClick(this);
        }
    }

    handleSquareClicked(square, piece) {
        if (this.props.is_deck_selected){
            if (this.props.selected_piece){
                if (this.props.valid_piece_positions && this.props.valid_piece_positions.includes(square)){
                    this.deck.pieces[square] = this.props.selected_piece.name;
                }
            } else {
                this.deck.pieces[square] = null;
            }
            this.props.onUpdateDeck();
        }
    }

    handleSelectColor(color, deck) {
        this.props.onSelectColor(color, deck);
    }

    handleNameTyped(evt){
        this.deck.name = evt.target.value
        this.props.onUpdateDeck();
    }

    drawChessBoard() {
        let chessboard = [];
        let files = [<th></th>];
        for (let i = 0; i < 2; i += 1) {
            let row = [];
            for (let j = 0; j < 8; j += 1) {
                let square = ((i * 8) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let selected_square = (square === this.state.selected_square);
                if (!this.props.can_pieces_be_selected){
                    selected_square = -1;
                }
                let name = this.deck.pieces[square];
                let piece = null;
                if (name && PIECE_MAPPING[name]){
                    piece = name ? new PIECE_MAPPING[name](WHITE) : null;
                }
                let is_an_option = this.props.valid_piece_positions && this.props.valid_piece_positions.includes(square);
                let is_clickable = (this.props.can_pieces_be_selected && piece) ||
                                   (this.props.valid_piece_positions && this.props.valid_piece_positions.includes(square));
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            isSelected={selected_square === square}
                            isAnOption={is_an_option}
                            isClickable={is_clickable}
                            isCheck={false}
                            onClick={this.handleSquareClicked.bind(this, square, piece)}/>
                );
            }
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return chessboard;
    }

    drawChooseMainDeck() {
        let pawn_white = "/assets/pieces/ClassicPawnWhite.svg";
        let pawn_black = "/assets/pieces/ClassicPawnBlack.svg";
        let filterWhite = this.props.deck.selected_as_white ? "" : "unselected";
        let filterBlack = this.props.deck.selected_as_black ? "" : "unselected";
        return(
        <div className="select-color">
            <img alt="" className={filterWhite} onClick={this.handleSelectColor.bind(this, WHITE, this.props.deck)} src={`${process.env.PUBLIC_URL}${pawn_white}`}/>
            <img alt="" className={filterBlack} onClick={this.handleSelectColor.bind(this, BLACK, this.props.deck)} src={`${process.env.PUBLIC_URL}${pawn_black}`}/>
        </div>);
    }

    drawDeckInfo() {
        let select_color = ""
        if(!this.props.is_deck_selected){
            select_color = this.drawChooseMainDeck()
        }
        let value = 0;
        for (let k in this.deck.pieces){
            let piece_name = this.deck.pieces[k]
            let piece_value = 0;
            if (piece_name && PIECE_MAPPING[piece_name]){
                piece_value = new PIECE_MAPPING[piece_name](WHITE).value;
            }
            value += piece_value;
        }
        let value_class = value > 40 ? "value over" : "value";
        return (
            <div className="info">
                {select_color}
                <div class="value-container">
                    <span className={value_class}>{value}</span><span class="max-value">/40</span>
                </div>
            </div>
        );
    }

    drawContent(){
        let deck_name = <div className="name">{this.deck.name}</div>
        if(this.props.is_deck_selected){
            deck_name = <input className="name" type="text" value={this.deck.name} maxlength="30" onChange={this.handleNameTyped.bind(this)}></input>
        }
        return(
            <div onClick={this.handleClick.bind(this)} className="content">
                {deck_name}
                <table className="chess-board">
                    {this.drawChessBoard()}
                </table>
            </div>);
    }

    render(){
        let entry_class = "deck-entry"
        if(!this.props.is_deck_selected){
            entry_class = "deck-entry selectable"
        }
        return (
        <React.Fragment>
            <div className={entry_class}>
                {this.drawContent()}
                {this.drawDeckInfo()}
            </div>
        </React.Fragment>);
    }
}

export default DeckEntry
