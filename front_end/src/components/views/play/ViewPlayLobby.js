import React from 'react'
import { Helmet } from 'react-helmet'
import Lobby from './Lobby'
import PlayStats from './PlayStats'
import { InfoPanel } from '../../navigation'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'

class ViewPlayLobby extends React.Component {
    state = {
        is_overlay_open: false,
        available_times: [
            [1, 0],
            [1, 1],
            [3, 0],
            [3, 1],
            [5, 0],
            [5, 3],
            [10, 0],
            [10, 5],
            [15, 0],
            [15, 10],
            [30, 0],
            [30, 20],
        ]
    }

    handleCreateGame(time, increment){
        this.props.onCreateGame(time*1000*60, increment*1000);
    }

    openOverlay(){
        this.setState({
            is_overlay_open: true
        })
    }

    closeOverlay(){
        this.setState({
            is_overlay_open: false
        })
    }

    drawAvailableTimes(){
        let time_elements = []
        for(let time_control of this.state.available_times){
            let time = time_control[0];
            let increment = time_control[1];
            time_elements.push(
                <div class="time-container">
                    <span class="button flat dark time" onClick={this.handleCreateGame.bind(this, time, increment)}>{time}+{increment}</span>
                </div>
            )
        }
        return <div class="available-times">{time_elements}</div>;
    }

    drawSelectedDeck(){
        return (
            <div class="selected-decks">
                <div class="title">Current decks:</div>
                <div class="entry">
                    <div class="deck-color white"></div>
                    <div>{this.props.decks[WHITE].name}</div>
                </div>
                <div class="entry">
                    <div class="deck-color black"></div>
                    <div>{this.props.decks[BLACK].name}</div>
                </div>
            </div>
        );
    }

    render() {
        let overlay = ''
        if(this.state.is_overlay_open){
            overlay = (
                <div class="overlay">
                    <div class="box">
                        <div className="title grey">
                            <div>
                                <span class="main">Create a new game</span>
                                <span class="sub">Choose a time control</span>
                            </div>
                        </div>
                        <div className="content">
                            {this.drawAvailableTimes()}
                            <div class="button-container">
                                <button class="button light" onClick={this.closeOverlay.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - Lobby</title>
            </Helmet>
            {overlay}
            <InfoPanel isOpen={this.props.error} type="error" message={this.props.errorMsg} />
            <div className="play-lobby-container view-padding">
                <div class="lobby-actions">
                    {this.drawSelectedDeck()}
                    <PlayStats/>
                    <button class="button" onClick={this.openOverlay.bind(this)}>Create Game</button>
                </div>
                <Lobby user={this.props.user}
                       api={this.props.api}
                       onAcceptGameOffer={this.props.onAcceptGameOffer}
                       onCreateGame={this.openOverlay.bind(this)}/>
            </div>
        </React.Fragment>)
    }
}

export default ViewPlayLobby
