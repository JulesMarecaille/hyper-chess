import React from 'react'
import Square from '../../../chess/ui/Square'
import { PIECE_MAPPING, piece_list} from '../../../chess/model/pieces/index'
import '../../../chess/ui/style.css'
import { WHITE, BLACK } from '../../../chess/model/constants'

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
        this.score = 0;
        this.state = {
          selected : -1,
          color : WHITE,
          clicked_name : false,
          name : null,
          valid_pos : this.props.valid_pos
        }

    }

    handleClick(evt){
        this.props.onClick(this);
    }

    clickedSquare(square) {
        if (this.clicked){
            let selected = -1;
            if (this.state.selected !== square){
                if (this.props.choosen_one !== -1){
                    if (this.props.valid_pos ? this.props.valid_pos.includes(square) : false){
                        let name = piece_list[this.props.choosen_one];
                        this.deck.pieces[square] = name;
                        selected = -1;
                    }
                    else{
                        //display error panel, place non autorisé
                    }
                }
                else{
                    selected = square;
                }
            }
            else{
              selected = -1;
            }
            this.props.onSelectPiece(selected);
            this.setState({selected: selected});
        }
    }

    drawChessBoard() {
        let chessboard = [];
        let files = [<th></th>];
        console.log(this.props.valid_pos);
        for (let i = 0; i < 2; i += 1) {
            let row = [];
            for (let j = 0; j < 8; j += 1) {
                let square = ((i * 8) + j)
                let square_color = "dark"
                if ((i + j) % 2 === 0){
                    square_color = "light"
                }
                let name = this.deck.pieces[square];

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
                                      isAnOption={this.props.valid_pos ? this.props.valid_pos.includes(square) : false}
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

    selectColor(color)
    {
      this.props.onChangeColor(color, this.deck_index);
    }

    drawChooseMainDeck()
    {
      let img = "/assets/pieces/ClassicPawnWhite.svg";
      let img_b = "/assets/pieces/ClassicPawnBlack.svg";
      let filterWhite = this.props.user.white_select === this.deck_index ? "" : "filter";
      let filterBlack = this.props.user.black_select === this.deck_index ? "" : "filter";
      return(
      <div className="line">
        <img alt="" className={filterWhite} onClick={this.selectColor.bind(this, WHITE)} src={`${process.env.PUBLIC_URL}${img}`}/>
        <img alt="" className={filterBlack} onClick={this.selectColor.bind(this, BLACK)} src={`${process.env.PUBLIC_URL}${img_b}`}/>
      </div>);
    }

    getScore()
    {
      this.score = 0;
      let name;

      for (let k in this.deck.pieces)
      {
        name = this.deck.pieces[k]
        let piece = name ? new PIECE_MAPPING[name](WHITE) : false;
        if (piece)
          this.score += piece.score;
      }
      this.deck.score = this.score;
      let color = this.score > 40 ? "red" : "";
      return (<div className={color}>{this.score}</div>);
    }

    colorSwitch()
    {
      let new_color = this.deck.color === BLACK ? WHITE : BLACK;
      this.deck.color = new_color;
      this.setState({color: new_color});
    }

    colorSelect()
    {
        //let img = "/assets/picto/ying_yang.svg";
        //<img src={`${process.env.PUBLIC_URL}${img}`}/>
      return (
        <div onClick={this.colorSwitch.bind(this)}>
            color
        </div>
      )
    }

    drawDeckInfo()
    {
      let text4 = "Score : ";
      let deckInfo =[<div>
        {this.drawChooseMainDeck()}{text4}{this.getScore()}
        {this.colorSelect()}
        </div>];
      return (deckInfo);
    }

    clickedName(){
        this.setState({
            clicked_name : true
        })

    }

    clickedOkName(){
        this.setState({
            clicked_name : false
        })
        if (this.state.name)
            this.deck.name = this.state.name;
    }

    drawName(){
        if (this.state.clicked_name){
            return (this.drawInput(this.deck.name));
        }
        return (<div onClick={this.clickedName.bind(this)}>{this.deck.name}</div>);
    }
    drawDeckImage(){
        let deckName =[];
        let deckImage = [];
        deckName.push(<div className="line">{this.drawName()}</div>);//nom du deck
        deckImage.push(<table className="chess-board">
            {this.drawChessBoard()}
          </table>);
        deckImage = <div  onClick={this.handleClick.bind(this)}>{deckImage}</div>;
        return(<div className="deckCase">{deckName}{deckImage}</div>);
    }

    handleInput = event => {
        this.setState({ name: event.target.value });
    };

    drawInput(name)
    {
        return(
            <div className="line"><input onChange={this.handleInput} placeholder={name} />
                <button onClick={this.clickedOkName.bind(this)}>ok</button>
            </div>
        )
    }

    render()
    {
      return (
      <React.Fragment>
          <div className="deck">
            <div className="totalDeckCase">
              <div className="deck">
                {this.drawDeckImage()}</div>
              <div> {this.drawDeckInfo()}</div>
            </div>
          </div>
      </React.Fragment>);
    }
}

export default OneDecks
