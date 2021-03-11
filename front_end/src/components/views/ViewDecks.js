import React from 'react'
import Decks from '../../chess/ui/Decks.js'
import { WHITE, BLACK } from '../../chess/model/constants.js';
import { createUser } from '../../chess/model/utils.js';

class ViewDeck extends React.Component {

    render() {
        return (
        <React.Fragment>
            <p>This is the Decks pages</p>
            <Decks name="first library of decks" owner={createPlayer("Octave")}/>
        </React.Fragment>)
    }
}

export default ViewDeck
