import React from 'react'
import { ImContrast } from 'react-icons/im'
import { Loader } from '../../navigation'
import { socket } from '../../../connection/socket'

class Lobby extends React.Component {
    state = {
        gameoffers: [],
        is_loading: false
    }

    componentDidMount(){
        this.getGameOffers();
        //setInterval(this.getGameOffers.bind(this), 10000);
    }

    getGameOffers(){
        this.setState({
            is_loading: true
        })
        this.props.api.getLobby().then((gameoffers) => {
            this.setState({
                gameoffers: gameoffers,
                is_loading: false
            })
        })
        .catch((err) => {
            this.setState({
                gameoffers: [],
                is_loading: false
            })
        });
    }

    handleAcceptGameOffer(game_id){
        this.props.onAcceptGameOffer(game_id)
    }

    drawLobby() {
        let lobby = [];
        for(let gameoffer of this.state.gameoffers){
            let row = (
                <tr class="entry" onClick={this.handleAcceptGameOffer.bind(this, gameoffer.id)}>
                    <td class="icon"><ImContrast/></td>
                    <td class="player-name">{gameoffer.User.name}</td>
                    <td class="player-elo">{gameoffer.User.elo}</td>
                </tr>
            )
            lobby.push(row)
        }
        return lobby;
    }

    render() {
        let info = "";
        if(this.state.is_loading) {
            info = <Loader />
        } else if (this.state.gameoffers.length === 0){
            info = (
                <div>
                    <div class="info">There's currently no game offers.</div>
                    <div class="button-container center">
                        <button class="button" onClick={this.props.onCreateGame}>Create one</button>
                    </div>
                </div>
            )
        }

        return (
        <React.Fragment>
            <div class="lobby-container">
                <table className="lobby">
                    <colgroup span="3" class="columns"></colgroup>
                    <tbody>
                        <tr class="header">
                            <th class="icon"></th>
                            <th class="player-name">Player</th>
                            <th class="player-elo">Elo</th>
                        </tr>
                        {this.drawLobby()}
                    </tbody>
                </table>
                <div class="info-container">
                    {info}
                </div>
            </div>
        </React.Fragment>)
    }
}

export default Lobby
