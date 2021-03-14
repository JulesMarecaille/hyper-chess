import React from 'react'
import { ViewPlayLobby, ViewPlayGame } from './play'
import { socket } from '../../connection/socket'
import { WHITE, BLACK } from '../../chess/model/constants'

class ViewPlay extends React.Component {
    state = {
        // lobby
        is_creator: false,
        game_offer_was_deleted: false,
        error_msg: "",

        // Game
        game_id: null
    }

    componentDidMount(){
        socket.on("joinError", (error_msg) => {
            this.setState({
                game_id: null,
                error_msg: error_msg
            })
        });
    }

    componentWillUnmount(){
        this.exitGame()
    }

    createGame(){
        this.props.api.createGameOffer().then((game) => {
            this.setState({
                game_id: game.id,
                is_creator: true,
                game_offer_was_deleted: false
            })
            socket.emit("createNewGame", {game_id: game.id, user: this.props.user})
        }).catch((err) => {
        });
    }

    deleteGameOfferIfNecessary(){
        if(!this.state.game_offer_was_deleted && this.state.is_creator){
            this.props.api.deleteGameOffer(this.state.game_id)
            this.setState({
                game_offer_was_deleted: true
            });
        }
    }

    joinGame(game_id){
        this.setState({
            game_id: game_id,
            game_offer_was_deleted: false
        });
        socket.emit("playerJoinedGame", {game_id: game_id, user: this.props.user})
    }

    exitGame(){
        this.deleteGameOfferIfNecessary();
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
                              onGameStart={this.deleteGameOfferIfNecessary.bind(this)}
                              onOpponentJoined={this.deleteGameOfferIfNecessary.bind(this)}
                              />
            );
        } else {
            content = (
                <ViewPlayLobby api={this.props.api}
                               user={this.props.user}
                               onCreateGame={this.createGame.bind(this)}
                               onAcceptGameOffer={this.joinGame.bind(this)}
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
