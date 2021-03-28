import React from 'react'
import Board from '../model/Board'
import Square from './Square'
import Piece from './Piece'
import { PIECE_MAPPING, piece_list} from '../model/pieces/index.js'
import './style.css'
import { WHITE, BLACK } from '../model/constants.js'
import { createClassicDeck, createClassicKnightDeck, createClassicQueenDeck } from '../model/utils.js';
import OneDeck from './OneDeck.js'

class DeckPieces extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      selected : -1
    }
  }

  drawPieces()
  {
    return(<div>
    <table className="chess-board">
      {this.drawChessBoard()}
      </table></div>)
  }

  clickedSquare(square)
  {
    console.log(square);
    let selected_square;
    if (this.state.selected != square)
      selected_square = square;
    else
      selected_square = -1;
    this.setState({selected: selected_square});
    this.props.choosen_one = selected_square;
  }

  drawChessBoard() {
      let chessboard = [];
      let files = [<th></th>];
      let files_label = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      for (let i = 0; i < 8; i += 1) {
          let row = [];
          row.push(<th className="outer">{8 - i}</th>)
          for (let j = 0; j < 8; j += 1) {
              let square = ((i * 8) + j)
              let square_color = "dark"
              if ((i + j) % 2 === 0){
                  square_color = "light";
              }
              let piece = piece_list[i*8+j] ? new PIECE_MAPPING[piece_list[i*8+j]](square === this.state.selected ? BLACK : WHITE) : false;
              // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
              row.push(
                  <Square square={square}
                          color={square_color}
                          piece={piece}
                          onClick={this.clickedSquare.bind(this)}
                          isSelected={false}
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

  render()
  {
    return(
    <React.Fragment>
      {this.drawPieces()}
    </React.Fragment>);
  }
}

export default DeckPieces
