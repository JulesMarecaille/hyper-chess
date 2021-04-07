import React from 'react'
import { ViewPlayLobby, ViewPlayGame } from './play'
import { Loader } from '../navigation'
import { socket, initSocket } from '../../connection/socket'
import { WHITE, BLACK } from 'hyperchess_model/lib/constants'
import { v4 as uuidv4 } from 'uuid';

class ViewPlay extends React.Component {
    state = {
        // decks
        decks: {},

        // lobby
        error_msg: "",
        error: false,

        // Game
        game_id: null,
        reconnection_data: null,

        // interface
        is_loading: true
    }

    componentDidMount(){
        initSocket(this.props.api.token)
        socket.on("joinError", (error_msg) => {
            this.setState({
                game_id: null,
                error_msg: error_msg,
                error: true
            })
        });

        socket.on("reconnectToGame", (data) => {
            this.setState({
                game_id: data.game_id,
                reconnection_data: data
            })
        })

        socket.emit("tryToReconnect", {user_id: this.props.user.id});

        this.props.api.getSelectedDecksFromUser(this.props.user.id).then((decks) => {
            this.setState({
                decks: decks,
                is_loading: false
            })
        }).catch((err) => {})
    }

    componentWillUnmount(){
        socket.removeAllListeners("joinError");
        socket.removeAllListeners("reconnectToGame");
    }

    createGame(time, increment){
        let game_id = uuidv4()
        let data = {
            time: time,
            increment: increment,
            game_id: game_id,
            user: this.props.user,
            user_decks: this.state.decks,
            reconnection_data: null
        }
        socket.emit("createNewGame", data)
        this.setState({
            game_id: game_id,
        })
    }

    joinGame(game_id){
        this.setState({
            game_id: game_id,
            game_offer_was_deleted: false,
            reconnection_data: null
        });
        socket.emit("playerJoinedGame", {game_id: game_id, user: this.props.user, user_decks: this.state.decks})
    }

    exitGame(){
        if (this.state.game_id){
            socket.emit("leaveGame", this.state.game_id)
            this.setState({
                game_id: null,
                reconnection_data: null
            });
        }
    }

    render() {
        let content = "";
        if(this.state.is_loading){
            content = <Loader/>
        } else if(this.state.game_id){
            content = (
                <ViewPlayGame api={this.props.api}
                              user={this.props.user}
                              game_id={this.state.game_id}
                              reconnectionData={this.state.reconnection_data}
                              onExitGame={this.exitGame.bind(this)}
                              onUpdateUser={this.props.onUpdateUser}
                              />
            );
        } else {
            content = (
                <ViewPlayLobby api={this.props.api}
                               user={this.props.user}
                               decks={this.state.decks}
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
