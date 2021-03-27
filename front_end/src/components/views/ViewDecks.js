import React from 'react'
import Deck from '../../chess/model/Deck'
import ViewAllDecks from './deck/ViewAllDecks'
import ViewSelectedDeck from './deck/ViewSelectedDeck'
import { WHITE, BLACK } from '../../chess/model/constants.js'
import { createUser } from '../../chess/model/utils.js'

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

class ViewDecks extends React.Component {
    constructor(props){
        super(props);
        this.tmp_deck = new Deck();
        this.state = {
            selected_deck : null,
            clicked : false,
            loading : true,
            deck_index : -1,
            decks : [],
            collection : []
        }
    }

    componentWillMount(){
        let k = 2;
      this.props.api.getAllDecksFromUser(this.props.user.id).then((decks) => {
          this.setState({
              decks : decks
          });
          k++;
          if (k === 2)
          {
              this.setState({
                  loading : false
              });
          }
      }).catch((err) => {})
      this.props.api.getUserCollection(this.props.user.id).then((collection) => {
          this.setState({
              collection : collection
          });
          k++;
          if (k === 2)
          {
              this.setState({
                  loading : false
              });
          }
      }).catch((err) => {})
  }

    deckRefreshTmp(deck)
    {
        this.tmp_deck.pieces = deck.pieces.slice();
        this.tmp_deck.name = deck.name;
    }

    deckIsChanged(deck){
        if (arrayEquals(this.tmp_deck.pieces, deck.pieces)
                && this.tmp_deck.name === deck.name){
            return (false);
        }
        return (true);
    }

      clickedDeck(deck, index)
      {
          if (deck)
          {
              this.deckRefreshTmp(deck);
              this.setState({clicked:true,
                  selected_deck : deck,
                  deck_index:index
              });
        }
      }

      addDeck(){
          let new_deck = new Deck();
          this.state.decks.push(new_deck);
          this.setState({clicked:true,
              selected_deck : new_deck,
              deck_index : this.state.decks.length - 1
          });
      }

      onChangeColor(color, index)
      {
        this.setState({color:color});
        if (color === WHITE){
          this.props.user.white_select = this.props.user.white_select === index ? 0 : index;//remlacer par des fonction SET
        }
        if (color === BLACK){
          this.props.user.black_select = this.props.user.black_select === index ? 0 : index;;
        }
      }

      clickedReturn(){
          if (!this.state.selected_deck.UserId){
              this.props.api.newDeck(this.state.selected_deck);
          }
          else if(this.deckIsChanged(this.state.selected_deck)){
             this.props.api.updateDeck(this.state.selected_deck.id, this.state.selected_deck);
          }
          this.setState({clicked:false,
              selected_deck : false,
              deck_index : -1
          });
      }

      clickedDelete()
      {
        if (this.state.selected_deck.UserId)
              this.props.api.deleteDeck(this.state.selected_deck.id);
        this.state.decks.splice(this.state.deck_index, 1);
        this.setState({clicked:false,
            selectedDeck : false,
            deck_index : -1
        });
      }

      render()
      {
        let content;
        if (!this.state.clicked){
            content = <ViewAllDecks name="Your  Library Of Decks"
                user={this.props.user}
                api={this.props.api}
                addDeck={this.addDeck.bind(this)}
                decks={this.state.decks}
                clickedDeck={this.clickedDeck.bind(this)}
                onChangeColor={this.onChangeColor.bind(this)}/>;
        }
        else{
            content = <ViewSelectedDeck deck={this.state.selected_deck}
                user={this.props.user}
                clickedReturn={this.clickedReturn.bind(this)}
                clickedDelete={this.clickedDelete.bind(this)}
                onChangeColor={this.onChangeColor.bind(this)}
                collection={this.state.collection}/>
        }
        return (
        <React.Fragment>
            {content}
        </React.Fragment>);
    }
}

export default ViewDecks
