import React from 'react'
import Decks from '../../chess/ui/Decks.js'
import { WHITE, BLACK } from '../../chess/model/constants.js';
import { createUser } from '../../chess/model/utils.js';

class ViewDeck extends React.Component {

    render() {
        return (
        <React.Fragment>
            <Decks name="Your Library Of Decks"
            user={createUser("Octave")}/>
        </React.Fragment>)
    }
}

export default ViewDeck
