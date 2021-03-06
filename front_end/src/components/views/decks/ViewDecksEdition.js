import React from 'react'
import { Helmet } from 'react-helmet'
import DeckEntry from './DeckEntry'
import { Square } from '../../chess'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { PIECE_MAPPING } from 'hyperchess_model/lib/pieces'
import { WHITE, BLACK, ALLOWED_POS, ALLOWED } from 'hyperchess_model/lib/constants'
import { getAllowedPosition } from 'hyperchess_model/lib'

class ViewDecksEdition extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected_piece: null,
            selected_piece_from_entry: null,
            color: WHITE,
            valid_piece_positions: [],
            is_delete_overlay_open: false
        };
        this.pieces_list = [];
        for(const [piece_name, is_bought] of Object.entries(this.props.collection)){
            if (is_bought){
                this.pieces_list.push(new PIECE_MAPPING[piece_name](WHITE));
            }
        }
    }

    handleSquareClicked(square, piece){
        if (piece){
            this.setState({
                selected_square: square,
                selected_piece: piece,
                valid_piece_positions: getAllowedPosition(piece.allowed),
                selected_piece_from_entry: null
            });
        } else {
            this.setState({
                selected_square: -1,
                selected_piece: null,
                valid_piece_positions: [],
                selected_piece_from_entry: null
            })
        }
    }

    handleUpdateDeck(){
        this.setState({update:1})
    }

    openOverlay(){
        this.setState({
            is_delete_overlay_open: true
        })
    }

    closeOverlay(){
        this.setState({
            is_delete_overlay_open: false
        })
    }

    drawOverlay(){
        if(this.state.is_delete_overlay_open){
            return (
                <div class="overlay">
                    <div class="box">
                        <div className="title grey">
                            <div>
                                <span class="main">Delete this deck?</span>
                            </div>
                        </div>
                        <div className="content">
                            <div class="button-container">
                                <button class="button" onClick={this.props.onDeleteDeck.bind(this)}>Yes</button>
                                <button class="button light" onClick={this.closeOverlay.bind(this)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return "";
    }

    drawChessBoardOfCollection() {
        let chessboard = [];
        let width = 6;
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 0; i < 6; i += 1) {
            let row = [];
            row.push(<th className="outer">{6 - i}</th>)
            for (let j = 0; j < width; j += 1) {
                let square = ((i * width) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light";
                }
                let is_selected = (square === this.state.selected_square);
                let piece = this.pieces_list[i * width + j]
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.handleSquareClicked.bind(this, square, piece)}
                            isSelected={is_selected}
                            isAnOption={false}
                            isClickable={piece}
                            isCheck={false}
                    />);
            }
            files.push(<th className="outer">{files_label[i]}</th>)
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return (
            <div>
                <table className="chess-board">
                    {chessboard}
                </table>
            </div>
        );
    }

    drawPieceInfo(){
        let name = "";
        let description = "";
        let value = "";
        let content = "";
        if (this.state.selected_piece){
            name = this.state.selected_piece.label;
            description = this.state.selected_piece.description;
            value = "Cost : " + this.state.selected_piece.value;
            content = (
                <div class="piece-info">
                    <div class="name">
                        {name}
                    </div>
                    <div class="description">
                        {description}
                    </div>
                    <div class="value">
                        {value}
                    </div>
                </div>
            );
        } else {
            content = <div class="info">Click on a piece from your deck to remove it</div>
        }
        return(
            <div className="info-box">
                {content}
            </div>
        );
    }

    drawSaveOption(){
        let has_king = false;
        let number_of_pawns = 0;
        let value = 0;
        for(let i=0; i < this.props.deck.pieces.length; i++){
            if(this.props.deck.pieces[i] && PIECE_MAPPING[this.props.deck.pieces[i]]){
                let piece = new PIECE_MAPPING[this.props.deck.pieces[i]](WHITE);
                if(i < 8){
                    number_of_pawns += 1;
                }
                if(piece.is_king){
                    has_king = true
                }
                value += piece.value;
            }
        }
        if(!has_king){
            return <div class="info">Your deck must have a king to be valid</div>
        }
        if(number_of_pawns < 8){
            return <div class="info">The top row of your deck must be filled with pieces to be valid</div>
        }
        if(value > 40){
            return <div class="info">The value of your deck is too high</div>
        }
        return <div class="button" onClick={this.props.onEditDeck.bind(this)}>Save</div>
    }

    render(){
        let delete_button = '';
        if(this.props.isDeletable){
            delete_button = <div class="button light" onClick={this.openOverlay.bind(this)}>Delete</div>
        }
        return (
            <div className="edition-container view-padding">
                <Helmet>
                    <title>HyperChess - Deck {this.props.deck.name}</title>
                </Helmet>
                {this.drawOverlay()}
                <div className="edition">
                    <div class="pieces">
                        {this.drawChessBoardOfCollection()}
                        <DeckEntry
                            deck={this.props.deck}
                            user={this.props.user}
                            is_deck_selected={true}
                            selected_piece={this.state.selected_piece}
                            can_pieces_be_selected={!this.state.selected_piece}
                            valid_piece_positions={this.state.valid_piece_positions}
                            onUpdateDeck={this.handleUpdateDeck.bind(this)}
                        />
                    </div>
                    {this.drawPieceInfo()}
                </div>
                <div className="actions">
                    {this.drawSaveOption()}
                    {delete_button}
                </div>
            </div>
        );
    }
}

export default ViewDecksEdition
