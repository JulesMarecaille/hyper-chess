import React from 'react'
import { Deck } from 'hyperchess_model/lib'
import { Loader } from '../navigation';
import { ViewDecksBrowse, ViewDecksEdition} from './decks'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'

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
            is_loading : true,
            decks : [],
            collection : []
        }
    }

    componentWillMount(){
        let k = 0;
        this.props.api.getAllDecksFromUser(this.props.user.id).then((decks) => {
            this.setState({
                decks : decks
            });
            k++;
            if (k === 2){
                this.setState({
                    is_loading : false
                });
            }
        }).catch((err) => {})

        this.props.api.getUserCollection(this.props.user.id).then((collection) => {
            this.setState({
                collection : collection
            });
            k++;
            if (k === 2){
                this.setState({
                    is_loading : false
                });
            }
        }).catch((err) => {})
    }

    hasDeckChanged(deck){
        if (arrayEquals(this.tmp_deck.pieces, deck.pieces)
            && this.tmp_deck.name === deck.name){
            return false;
        }
        return true;
    }

    handleDeckSelected(deck){
        if (deck){
            this.tmp_deck.pieces = deck.pieces.slice();
            this.tmp_deck.name = deck.name;
            this.setState({
                selected_deck : deck,
            });
        }
    }

    handleCreateDeck(){
        let new_deck = new Deck();
        this.setState({
            selected_deck: new_deck,
        });
    }

    handleEditDeck(){
        let payload = {
            pieces: this.state.selected_deck.pieces,
            name: this.state.selected_deck.name
        }
        if (!this.state.decks.map(x => x.id).includes(this.state.selected_deck.id)){
            this.props.api.newDeck(payload);
            this.state.decks.push(this.state.selected_deck)
        } else if(this.hasDeckChanged(this.state.selected_deck)){
            this.props.api.updateDeck(this.state.selected_deck.id, payload);
        }
        this.setState({
            selected_deck: null,
        });
    }

    handleDeleteDeck(){
        if(this.state.decks.length > 1){
            let deck_index = -1;
            for(let i=0; i < this.state.decks.length; i++){
                if (this.state.decks[i].id === this.state.selected_deck.id) {
                    deck_index = i;
                }
            }
            if(deck_index !== -1){
                this.state.decks.splice(deck_index, 1);
            }
            this.setState({
                selected_deck : null,
            });
            if (this.state.selected_deck.UserId){
                this.props.api.deleteDeck(this.state.selected_deck.id);
            }
        }
    }

    handleSelectColorDeck(color, deck){
        for(let i=0; i < this.state.decks.length; i++){
            if(deck.id === this.state.decks[i].id){
                if(color === WHITE){
                    this.state.decks[i].selected_as_white = true
                    this.props.api.updateDeck(this.state.decks[i].id, {selected_as_white: true});
                } else if (color === BLACK) {
                    this.state.decks[i].selected_as_black = true
                    this.props.api.updateDeck(this.state.decks[i].id, {selected_as_black: true});
                }
            } else {
                if(color === WHITE){
                    this.state.decks[i].selected_as_white = false
                } else if (color === BLACK) {
                    this.state.decks[i].selected_as_black = false
                }
            }
        }
        this.setState({udpate:1})

    }

    render(){
        let content;
        if(this.state.is_loading){
            content = <Loader/>
        } else if (!this.state.selected_deck){
            content = <ViewDecksBrowse user={this.props.user}
                                       api={this.props.api}
                                       decks={this.state.decks}
                                       onCreateDeck={this.handleCreateDeck.bind(this)}
                                       onDeckSelected={this.handleDeckSelected.bind(this)}
                                       onSelectColor={this.handleSelectColorDeck.bind(this)}
                                       />;
        }
        else{
            let is_deletable = (this.state.decks.length > 1 &&
                               !this.state.selected_deck.selected_as_white &&
                               !this.state.selected_deck.selected_as_black);
            content = <ViewDecksEdition user={this.props.user}
                                        deck={this.state.selected_deck}
                                        collection={this.state.collection}
                                        isDeletable={is_deletable}
                                        onEditDeck={this.handleEditDeck.bind(this)}
                                        onDeleteDeck={this.handleDeleteDeck.bind(this)}
                                        onSelectColor={this.handleSelectColorDeck.bind(this)}
                                        />;
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default ViewDecks
