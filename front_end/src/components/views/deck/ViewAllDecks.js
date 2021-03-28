import React from 'react'
import OneDeck from './OneDeck.js'
import {MdAdd} from 'react-icons/md'

class ViewAllDecks extends React.Component {

    drawCreateDeck(){
        return(
            <div className="darkCase deckWidth" onClick={this.props.addDeck.bind(this)}>
                <div className="case deckWidth">
                    <MdAdd className="add_deck" alt=""/>
                </div>
            </div>
        );
    }

    drawAllDecks(){
      let all_decks = [];
        all_decks.push(this.drawCreateDeck());
        for (let k = 0 ; this.props.decks[k]; k++)
        {
        //all_decks.push(<div className="deck"> {this.drawDeck(this.state.decks[k], k)} </div>);
          all_decks.push(

            <OneDeck  deck={this.props.decks[k]}
                      onClick={this.props.clickedDeck.bind(this, this.props.decks[k], k)}
                      user={this.props.user}
                      onChangeColor={this.props.onChangeColor.bind(this)}
                      deck_index={k}
                      locked={false}/>
                  );
          }
      return (<div className="allDeck">{all_decks}</div>);
    }

    render(){
        return (
        <div>
            {this.drawAllDecks()}
        </div>);
    }
}

export default ViewAllDecks
