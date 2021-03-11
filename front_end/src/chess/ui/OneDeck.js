import React from 'react'
import Board from '../model/Board'
import Square from './Square'
import Piece from './Piece'
import { PIECE_MAPPING, piece_list } from '../model/pieces/index.js'
import './style.css'
import { WHITE, BLACK } from '../model/constants.js'
import { createClassicDeck, createClassicKnightDeck, createClassicQueenDeck } from '../model/utils.js';

class OneDecks extends React.Component
{
    constructor(props)
    {

        super(props);
        this.deck = props.deck;
        this.clicked = props.clicked;
        this.white = props.user.white_select;
        this.black = props.user.black_select;

        this.deck_index = props.deck_index;
        this.state = {
          selected : -1,
          color : this.deck.color
        }

    }

    handleClick(evt){
        this.props.onClick(this);
    }

    clickedSquare(square) {
      if (this.clicked)
      {
        let selected = -1;
        if (this.state.selected != square)
        {
          if (this.props.choosen_one !== -1)
          {
            let name = piece_list[this.props.choosen_one];
            this.deck.pieces[square] = name;
            selected = -1;
          }
          else
            selected = square;
        }
        else
          selected = -1;
        this.props.onSelectPiece(selected);
        this.setState({selected: selected});
      }
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
                let name = this.deck.pieces[8 * i + j];

                let selected = (square === this.state.selected);
                if (!this.props.canSelect)
                  selected = false;
                let piece = name ? new PIECE_MAPPING[name](this.state.color) : false;
                // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
                row.push(
                    <Square square={square}
                                      color={square_color}
                                      piece={piece}
                                      isSelected={selected}
                                      isAnOption={false}
                                      isClickable={false}
                                      isCheck={false}
                                      onClick={this.clickedSquare.bind(this)}/>);
            }
            chessboard.push(<tr>{row}</tr>);
        }
        chessboard.push(<tr>{files}</tr>);
        chessboard = [<tbody>{chessboard}</tbody>]
        return chessboard;
    }

    selectWhite()
    {
      this.props.onChangeColor(WHITE, this.deck_index);
    }

    selectBlack()
    {
      this.props.onChangeColor(BLACK, this.deck_index);
    }

    drawSelectColor()
    {
      let img = "/assets/pieces/ClassicPawnWhite.svg";
      let img_b = "/assets/pieces/ClassicPawnBlack.svg";
      let filterWhite = this.props.user.white_select == this.deck_index ? "" : "filter";
      let filterBlack = this.props.user.black_select == this.deck_index ? "" : "filter";
      return(
      <div>
        <img className={filterWhite} onClick={this.selectWhite.bind(this)} src={`${process.env.PUBLIC_URL}${img}`}/>
        <img className={filterBlack} onClick={this.selectBlack.bind(this)} src={`${process.env.PUBLIC_URL}${img_b}`}/>
      </div>);
    }

    getScore()
    {
      let score = 0;
      let name;
      for (let k in this.deck.pieces)
      {
        name = this.deck.pieces[k]
        let piece = name ? new PIECE_MAPPING[name](WHITE) : false;
        if (piece)
          score += piece.score;
      }
      return score;
    }

    colorSwitch()
    {
      let new_color = this.deck.color == BLACK ? WHITE : BLACK;
      this.deck.color = new_color;
      this.setState({color: new_color});
    }

    colorSelect()
    {

      return (
        <div onClick={this.colorSwitch.bind(this)}>
          Color
        </div>
      )
    }

    drawDeckInfo()
    {
      let text4 = "Score : ";
      let deckInfo =[<div><tr>
        {this.drawSelectColor()}{text4}{this.getScore()}
        {this.colorSelect()}
        </tr></div>];
      return (deckInfo);
    }

    drawDeckImage()
    {
      let deckImage = [];
      deckImage.push(<div className="line">  {this.deck.name}</div>);//nom du deck
      deckImage.push(<table className="chess-board">
          {this.drawChessBoard()}
      </table>);
      return(<div className="deckCase">{deckImage}</div>);
    }

    render()
    {
      return (
      <React.Fragment>
          <div className="deck">
            <div className="totalDeckCase">
              <div className="deck" onClick={this.handleClick.bind(this)}>
                {this.drawDeckImage()}</div>
              <div> {this.drawDeckInfo()}</div>
            </div>
          </div>
      </React.Fragment>);
    }
}

export default OneDecks
