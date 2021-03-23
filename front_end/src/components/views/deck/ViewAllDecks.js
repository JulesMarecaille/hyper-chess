import React from 'react'
import OneDeck from './OneDeck.js'

class ViewAllDecks extends React.Component {

    drawCreateDeck(){
        let img = "/assets/picto/plus.svg";
        return(
            <div className="deck"><div className="totalDeckCase" onClick={this.props.addDeck.bind(this)}>
                <img className="add_deck" alt="" src={`${process.env.PUBLIC_URL}${img}`}/>
            </div></div>
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
                      deck_index={k}/>);
          }
      return (<div className="allDeck">{all_decks}</div>);
    }

    render(){
        return (
        <div><h1> {this.props.name} </h1>
            {this.drawAllDecks()}
        </div>);
    }
}

export default ViewAllDecks
