import React from 'react'
import { Helmet } from 'react-helmet'
import DeckEntry from './DeckEntry'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MdAdd } from 'react-icons/md'

class ViewDecksBrowse extends React.Component {
    drawCreateDeck(){
        return(
            <div className="add-deck" onClick={this.props.onCreateDeck.bind(this)}>
                <MdAdd className="icon"/>
            </div>
        );
    }

    drawAllDecks(){
        let all_decks = [];
        for (let i=0; i < 9; i++){
            let deck = this.props.decks[i];
            if(deck){
                all_decks.push(
                    <DeckEntry deck={deck}
                               user={this.props.user}
                               onClick={this.props.onDeckSelected.bind(this, deck)}
                               onSelectColor={this.props.onSelectColor}
                               is_deck_selected={false}
                               can_pieces_be_selected={false}
                               key={deck.id}/>
                );
            } else {
                all_decks.push(this.drawCreateDeck())
            }
        }
        return all_decks;
    }

    render(){
        return (
            <React.Fragment>
                <Helmet>
                    <title>HyperChess - My decks</title>
                </Helmet>
                <PerfectScrollbar className="browse-decks view-padding">
                    {this.drawAllDecks()}
                </PerfectScrollbar>
            </React.Fragment>);
    }
}

export default ViewDecksBrowse
