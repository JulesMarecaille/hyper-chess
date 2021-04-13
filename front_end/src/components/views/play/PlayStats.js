import React from 'react'
import { socket } from '../../../connection/socket'

class PlayStats extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stats: {},
        }
        this.reload_stats_interval = null;
    }


    componentDidMount(){
        socket.on("receiveStats", (data) => {
            this.setState({
                stats: data,
            });
        });
        this.getStats();
        this.reload_stats_interval = setInterval(this.getStats.bind(this), 5000);
    }

    componentWillUnmount(){
        socket.removeAllListeners("receiveStats");
        clearInterval(this.reload_stats_interval);
    }

    getStats(){
        socket.emit("requestStats", {})
    }

    render() {
        return (
        <React.Fragment>
            <div class="play-stats">
                <div><span class="value">{this.state.stats.nb_online_players}</span> Players online</div>
                <div><span class="value">{this.state.stats.nb_games}</span> Games playing</div>
            </div>
        </React.Fragment>)
    }
}

export default PlayStats
