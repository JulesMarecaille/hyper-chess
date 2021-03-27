import React from 'react'
import OneDeck from './OneDeck.js'
import Square from '../../../chess/ui/Square'
import { PIECE_MAPPING, nbr_pieces } from '../../../chess/model/pieces/index'
import { WHITE, BLACK, ALLOWED_POS, ALLOWED } from '../../../chess/model/constants.js'

class ViewSelectedDeck extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            choosen_square : -1,
            choosen_one : -1,
            selected_one : -1,
            color : WHITE,
            valid_pos :[]
        };
        this.piece_list = [];
        for(const [piece_name, is_bought] of Object.entries(this.props.collection)){
            if (is_bought)
                this.piece_list.push(piece_name);
        }
    }

    drawPieces(){
      return(<div>
      <table className="chess-board">
        {this.drawChessBoardOfCollection()}
        </table></div>)
    }

    clickedSquare(square)
    {
        let piece = null;
        if (square < nbr_pieces + 1)
        {
            let selected_square;
            if (this.state.choosen_one !== square){
                selected_square = square;
                piece = new PIECE_MAPPING[this.piece_list[selected_square]];
            }
            else{
                selected_square = -1;
            }
            this.setState({choosen_one: selected_square,
                valid_pos : this.getValidPos(piece)
            });
        }
    }

    getValidPos(piece){
        if (!piece)
            return ;
        return (ALLOWED_POS[piece.allowed]);
    }

    drawChessBoardOfCollection() {
        let chessboard = [];
        let width = 6;
        let files = [<th></th>];
        let files_label = ['a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 0; i < 8; i += 1) {
            let row = [];
            row.push(<th className="outer">{8 - i}</th>)
            for (let j = 0; j < width; j += 1) {
                let square = ((i * width) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light";
                }
                let selected = (square === this.state.choosen_square);

                let piece = this.piece_list[i * width + j] ? new PIECE_MAPPING[this.piece_list[i * width + j]](this.state.color) : false;
                //if (piece)
                    //console.log(piece, piece.hasStartingPosition("bishop"));
                //to get through father wich will call DB
                // The square can be clicked if it's a move option or if there's a piece belonging to the player on it
                row.push(
                    <Square square={square}
                            color={square_color}
                            piece={piece}
                            onClick={this.clickedSquare.bind(this, square)}
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

    drawPieceInfo()
    {



        let name = this.piece_list[this.state.choosen_one];
        if (this.state.selected_one !== -1 && this.state.choosen_one === -1)
        {
            name = this.props.deck.pieces[this.state.selected_one];
        }
        let piece = name ? new PIECE_MAPPING[name](WHITE) : false;
        return(
            <div className="pieceInfo darkCase"><div className="textWrap">
            <h3>{name}</h3>
            {piece.description}
            </div></div>);
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
      if (color === WHITE)
      {
        this.props.user.white_select = this.props.user.white_select === index ? 0 : index;
      }
      if (color === BLACK)
        this.props.user.black_select = this.props.user.black_select === index ? 0 : index;;
    }

    drawEdition()
    {
        let edition = [];
        edition.push(  <OneDeck  deck={this.props.deck}
                  onClick={this.clickedEdition.bind(this)}
                  clicked={true}
                  choosen_one={this.state.choosen_one}
                  canSelect={this.state.choosen_one === -1}
                  onSelectPiece={this.handleChangePiece.bind(this)}
                  onChangeColor={this.handleChangeColor.bind(this)}
                  user={this.props.user}
                  deck_index={this.state.deck_index}
                  valid_pos={this.state.valid_pos}
                  locked={true}
                  piece_list={this.piece_list}/>);
        return (edition);
    }

    render(){
        let del = this.props.deck.UserId ? "Delete" : "Abort";
        return (
        <div>
          <div> Pieces Collection </div>
          <div className="line">{this.drawPieces()}{this.drawPieceInfo()}</div>
          {this.drawEdition()}
          <div className="line">
            <div className="deckCase">
              <div onClick={this.props.clickedReturn.bind(this)}> Finished </div>
            </div>
            <div>
              <div onClick={this.props.clickedDelete.bind(this)}> {del} </div>
            </div>
          </div>
        </div>);
    }
}

export default ViewSelectedDeck
