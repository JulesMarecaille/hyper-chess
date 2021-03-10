import React from 'react'
import Game from '../../chess/ui/Game.js'
import { WHITE, BLACK } from '../../chess/model/constants.js';
import { createPlayer } from '../../chess/model/utils.js';

class ViewHome extends React.Component {
    state = {
    }

    render() {
        return (
        <React.Fragment>
            <Game side={WHITE}
                  whitePlayer={createPlayer("Jules")}
                  blackPlayer={createPlayer("Octave")}/>
        </React.Fragment>)
    }
}

export default ViewHome
