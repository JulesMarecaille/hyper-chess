import React from 'react'
import { ViewPlayLobby, ViewPlayGame } from './play'
import { socket } from '../../connection/socket'
import { WHITE, BLACK } from '../../chess/model/constants'
import { v4 as uuidv4 } from 'uuid';

class ViewPlay extends React.Component {
    state = {
        // lobby
        error_msg: "",
        error: false,

        // Game
        game_id: null
    }

    componentDidMount(){
        socket.on("joinError", (error_msg) => {
            this.setState({
                game_id: null,
                error_msg: error_msg,
                error: true
            })
        });
    }

    componentWillUnmount(){
        this.exitGame();
        socket.removeAllListeners("joinError");
    }

    createGame(time, increment){
        let game_id = uuidv4()
        let data = {
            time: time,
            increment: increment,
            game_id: game_id,
            user: this.props.user
        }
        socket.emit("createNewGame", data)
        this.setState({
            game_id: game_id,
        })
    }

    joinGame(game_id){
        this.setState({
            game_id: game_id,
            game_offer_was_deleted: false
        });
        socket.emit("playerJoinedGame", {game_id: game_id, user: this.props.user})
    }

    exitGame(){
        if (this.state.game_id){
            socket.emit("leaveGame", this.state.game_id)
            this.setState({
                game_id: null
            });
        }
    }

    render() {
        let content = "";
        if(this.state.game_id){
            content = (
                <ViewPlayGame api={this.props.api}
                              user={this.props.user}
                              game_id={this.state.game_id}
                              onExitGame={this.exitGame.bind(this)}
                              />
            );
        } else {
            content = (
                <ViewPlayLobby api={this.props.api}
                               user={this.props.user}
                               onCreateGame={this.createGame.bind(this)}
                               onAcceptGameOffer={this.joinGame.bind(this)}
                               error={this.state.error}
                               errorMsg={this.state.error_msg}/>
            );
        }
        return (
        <React.Fragment>
            {content}
        </React.Fragment>)
    }
}

export default ViewPlay
