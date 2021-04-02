import React from 'react'
import 'simplebar';
import 'simplebar/dist/simplebar.css';
import { ImContrast } from 'react-icons/im'
import { MdTimer, MdShowChart } from 'react-icons/md'
import { Loader } from '../../navigation'
import { socket } from '../../../connection/socket'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

class Lobby extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gameoffers: [],
            is_loading: false
        }
        this.reload_games_interval = null;
    }


    componentDidMount(){
        socket.on("receiveGameOffers", (data) => {
            this.setState({
                gameoffers: data,
                is_loading: false
            });
        });
        this.getGameOffers();
        this.reload_games_interval = setInterval(this.getGameOffers.bind(this), 5000);
    }

    componentWillUnmount(){
        socket.removeAllListeners("receiveGameOffers");
        clearInterval(this.reload_games_interval);
    }

    getGameOffers(){
        this.setState({
            is_loading: true
        })
        socket.emit("requestGameOffers", this.props.user.id)
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
                    <td class="player-name">{gameoffer.user.name}</td>
                    <td class="player-elo">{gameoffer.user.elo}</td>
                    <td class="time">{format_time(gameoffer.time)}+{format_increment(gameoffer.increment)}</td>
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
            <PerfectScrollbar className="lobby-container">
                <table className="lobby">
                    <colgroup span="4" class="columns"></colgroup>
                    <tbody>
                        <tr class="header">
                            <th class="icon"></th>
                            <th class="player-name">Player</th>
                            <th class="player-elo">Rating</th>
                            <th class="time"><MdTimer/></th>
                        </tr>
                        {this.drawLobby()}
                    </tbody>
                </table>
                <div class="info-container">
                    {info}
                </div>
            </PerfectScrollbar>
        </React.Fragment>)
    }
}

function format_time(time){
    // Get time in seconds
    time = time / 1000 ;

    // Cut it in minutes
    let minutes = Math.floor(time / 60);
    return minutes
}

function format_increment(time){
    return time / 1000
}

export default Lobby
