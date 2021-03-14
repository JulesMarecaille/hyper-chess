import React from 'react'
import Lobby from './Lobby'
import { InfoPanel } from '../../navigation'

class ViewPlayLobby extends React.Component {
    state = {
    }

    render() {
        return (
        <React.Fragment>
            <InfoPanel isOpen={this.props.error} type="error" message={this.props.errorMsg} />
            <div class="button-container">
                <button class="button" onClick={this.props.onCreateGame}>Create Game</button>
            </div>
            <Lobby api={this.props.api}
                   onAcceptGameOffer={this.props.onAcceptGameOffer}
                   onCreateGame={this.props.onCreateGame}/>
        </React.Fragment>)
    }
}

export default ViewPlayLobby
