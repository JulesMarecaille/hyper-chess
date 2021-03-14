import React from 'react'
import Game from '../../../chess/ui/Game.js'
import { Loader } from '../../navigation'
import { WHITE, BLACK, swapColor } from '../../../chess/model/constants.js';
import { createUser } from '../../../chess/model/utils.js';
import { createClassicDeck } from '../../../chess/model/utils.js';
import { socket } from '../../../connection/socket';

class ViewPlayGame extends React.Component {
    state = {
        is_game_ongoing: false,
        is_game_over: false,
        winner: null,
        side: null,
        players: null
    }

    componentDidMount(){
        socket.on("startGame", (data) => {
            // Extract side and opponent
            let side = BLACK;
            if (data.players[WHITE].id === this.props.user.id){
                side = WHITE;
            }
            this.setState({
                game_offer_was_deleted: false,
                side: side,
                players: data.players,
                is_game_ongoing: true
            });
            this.props.onGameStart();
        })

        socket.on("opponentLeft", () => {
            this.props.onExitGame();
        });
    }

    componentWillUnmount(){
        this.props.onExitGame();
    }

    drawEndGameScreen(result){
        return (
            <div>
                <div>game over</div>
                <div class="button-container">
                    <button class="button" onClick={this.props.onExitGame}>Exit</button>
                </div>
            </div>
        )
    }

    drawWaitingScreen(){
        return (
            <div>
                <div>Waiting for an opponent...</div>
                <Loader size="medium"/>
                <div class="button-container">
                    <button class="button" onClick={this.props.onExitGame}>Cancel</button>
                </div>
            </div>
        )
    }

    drawOverlay(overlay_content){
        return (
            <div class="overlay">
                <div class="box">
                    {overlay_content}
                </div>
            </div>
        )
    }

    drawPlayerInfo(player){
        let player_name = [<span className="name">{player.name}</span>, <span className="elo">({player.elo})</span>]
        let player_name_elo = [<div className="name-elo">{player_name}</div>]
        let player_info = [<div class="player-info">{player_name_elo}</div>]
        return player_info;
    }

    handleGameOver(winner){
        this.setState({
            winner: winner,
            is_game_over: true,
            is_game_ongoing: false
        })
    }

    render() {
        let content = '';
        if(this.state.is_game_ongoing){
            content = (
                <div className="chess-board-container">
                    {this.state.side === BLACK ? this.drawPlayerInfo(this.state.players[WHITE]) : this.drawPlayerInfo(this.state.players[BLACK])}
                    <Game side={this.state.side}
                          game_id={this.props.game_id}
                          whitePlayer={this.state.players[WHITE]}
                          blackPlayer={this.state.players[BLACK]}
                          whiteDeck={createClassicDeck()}
                          blackDeck={createClassicDeck()}
                          onGameOver={this.handleGameOver.bind(this)}
                    />
                    {this.state.side === BLACK ? this.drawPlayerInfo(this.state.players[BLACK]) : this.drawPlayerInfo(this.state.players[WHITE])}
                </div>
            )
        } else if (this.state.is_game_over){
            content = this.drawOverlay(this.drawEndGameScreen());
        } else {
            content = this.drawOverlay(this.drawWaitingScreen());
        }
        return (
        <React.Fragment>
            <div>
                {content}
            </div>
        </React.Fragment>)
    }
}

export default ViewPlayGame
