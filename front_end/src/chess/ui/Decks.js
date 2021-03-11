import React from 'react'
import Board from '../model/Board'
import Square from './Square'
import Piece from './Piece'
import { PIECE_MAPPING, piece_list, nbr_pieces } from '../model/pieces/index.js'
import './style.css'
import { WHITE, BLACK } from '../model/constants.js'
import { createClassicDeck, createClassicKnightDeck, createClassicQueenDeck } from '../model/utils.js';
import OneDeck from './OneDeck.js'

class Decks extends React.Component
{
    constructor(props)
    {
        super(props);
        this.deck_index = -1;
        this.state = {
          cliked : false,
          choosen_one : -1,
          selected_one : -1,
          color : WHITE
        };
        this.user = this.props.user;
        this.selectedDeck = null;
        this.props.user.decks = [createClassicDeck()];
        this.props.user.decks.push(createClassicKnightDeck());
        this.props.user.decks.push(createClassicQueenDeck());
        //this.props.user.decks.push(createClassicQueenDeck());
        //this.props.user.decks.push(createClassicQueenDeck());
    }

    drawPieces()
    {
      return(<div>
      <table className="chess-board">
        {this.drawChessBoard()}
        </table></div>)
    }

    drawChessBoard() {
        let chessboard = [];
        let wid = 6;
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 0; i < 8; i += 1) {
            let row = [];
            row.push(<th className="outer">{8 - i}</th>)
            for (let j = 0; j < wid; j += 1) {
                let square = ((i * wid) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light";
                }
                let selected = (square === this.state.choosen_one);
                let piece = piece_list[i * wid + j] ? new PIECE_MAPPING[piece_list[i * wid + j]](this.state.color) : false;
                // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.clickedSquare.bind(this)}
                            isSelected={selected}
                            isAnOption={false}
                            isClickable={false}
                            isCheck={false}
                    />);
            }
            files.push(<th className="outer">{files_label[i]}</th>)
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return chessboard;
    }

    clickedSquare(square)
    {
      if (square < nbr_pieces + 1)
      {
        let selected_square;
        if (this.state.choosen_one != square)
          selected_square = square;
        else
          selected_square = -1;
        this.setState({choosen_one: selected_square});
      }
    }

    clickedReturn(){
        this.setState({cliked:false});
        this.selectedDeck = false;
    }

    clickedDelete()
    {
      console.log(this.deck_index, this.user.decks);
      this.user.decks.splice(this.deck_index, 1);
      this.selectedDeck = false;
      this.setState({cliked:false});
    }

    clickedDeck(oneDeck)
    {
      oneDeck.clicked = true;
      this.selectedDeck = oneDeck.deck;
      this.deck_index = oneDeck.deck_index;
      this.setState({cliked:true});
    }

    clickedEdition()
    {

    }

    handleChangePiece(square)
    {
      this.setState({selected_one:square});
    }

    handleChangeColor(color, index)
    {
      this.setState({color:color});
      if (color == WHITE)
      {
        this.props.user.white_select = this.props.user.white_select == index ? 0 : index;
      }
      if (color == BLACK)
        this.props.user.black_select = this.props.user.black_select == index ? 0 : index;;
    }

    drawEdition()
    {
      let edition = [];
      edition.push(  <OneDeck  deck={this.selectedDeck}
                  onClick={this.clickedEdition.bind(this)}
                  clicked={true}
                  choosen_one={this.state.choosen_one}
                  canSelect={this.state.choosen_one === -1}
                  onSelectPiece={this.handleChangePiece.bind(this)}
                  onChangeColor={this.handleChangeColor.bind(this)}
                  user={this.props.user}
                  deck_index={this.deck_index}/>);
                  return (edition);
    }

    drawAllDecks()
    {
      let all_decks = [];

        for (let k = 0 ; this.props.user.decks[k]; k++)
        {
        //all_decks.push(<div className="deck"> {this.drawDeck(this.props.user.decks[k], k)} </div>);
          all_decks.push(
            <OneDeck  deck={this.props.user.decks[k]}
                      onClick={this.clickedDeck.bind(this)}
                      user={this.props.user}
                      onChangeColor={this.handleChangeColor.bind(this)}
                      deck_index={k}/>);
          }
      return (<div className="allDeck">{all_decks}</div>);
    }

    drawPieceInfo()
    {

      let name = piece_list[this.state.choosen_one];
      if (this.state.selected_one !== -1 && this.state.choosen_one === -1)
      {
        name = this.selectedDeck.pieces[this.state.selected_one];
      }
      let piece = name ? new PIECE_MAPPING[name](WHITE) : false;
      return(
      <div className="deckInfo"><div className="textWrap">
        <tr><h3>{name}</h3></tr>
        <tr>{piece.description}</tr>
      </div></div>);
    }

    drawSelect()
    {
      if (this.state.cliked)
      {
        return (
          <div>
            <div> Pieces Collection </div>
            <div className="line">{this.drawPieces()}{this.drawPieceInfo()}</div>
            {this.drawEdition()}
            <div className="line">
              <div className="deckCase">
                <h3 onClick={this.clickedReturn.bind(this)}> Finished </h3>
              </div>
              <div>
                <h3 onClick={this.clickedDelete.bind(this)}> Delete </h3>
              </div>
            </div>
          </div>);
      }
      else
      {
        return (
        <div><h1> {this.props.name} </h1>
          {this.drawAllDecks()}
          </div>
        );
      }
    }

    render()
    {
        return (
        <React.Fragment>
          {this.drawSelect()}
        </React.Fragment>);
    }
}

export default Decks
