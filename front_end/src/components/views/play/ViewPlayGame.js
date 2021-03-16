import React from 'react'
import Game from '../../../chess/ui/Game.js'
import { Loader } from '../../navigation'
import { WHITE, BLACK, swapColor } from '../../../chess/model/constants.js';
import { createUser } from '../../../chess/model/utils.js';
import { createClassicDeck } from '../../../chess/model/utils.js';
import { socket } from '../../../connection/socket';

class ViewPlayGame extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            is_game_over: false,
            winner: null,
            side: null,
            players: null,
            endgame_msg: "",
            is_overlay_open: true
        }
        this.game_start_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/GameStart.mp3")
        this.game_end_sound = new Audio(process.env.PUBLIC_URL + "/assets/sounds/GameEnd.mp3")
    }

    componentDidMount(){
        socket.on("startGame", (data) => {
            // Extract side and opponent
            let side = BLACK;
            if (data.players[WHITE].id === this.props.user.id){
                side = WHITE;
            }
            this.setState({
                side: side,
                players: data.players,
            });
            this.game_start_sound.play()
        })

        socket.on("opponentLeft", () => {
            this.setState({
                winner: this.state.side,
                is_game_over: true
            })
            this.game_end_sound.play()
        });
    }

    componentWillUnmount(){
        this.props.onExitGame();
        socket.removeAllListeners("startGame");
        socket.removeAllListeners("opponentLeft");
    }

    drawEndGameScreen(){
        let box_title;
        if(this.state.winner === null){
            box_title = <div className="title grey">Draw.</div>
        } else if (this.state.winner === this.state.side){
            box_title = <div className="title green">You won!</div>
        } else {
            box_title = <div className="title red">You lost.</div>
        }
        return (
            <div class="box">
                {box_title}
                <div className="content">
                    <div class="button-container">
                        <button class="button" onClick={this.props.onExitGame}>Back to Lobby</button>
                    </div>
                </div>
            </div>
        )
    }

    drawWaitingScreen(){
        return (
            <div class="box">
                <div className="title grey">Waiting for an opponent...</div>
                <div className="content">
                    <Loader size="medium"/>
                    <div class="button-container">
                        <button class="button" onClick={this.props.onExitGame}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }

    drawOverlay(overlay_content){
        return (
            <div class="overlay">
                {overlay_content}
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
        })
    }

    closeOverlay(){
        this.setState({
            is_overlay_open: false
        })
    }

    render() {
        let overlay = '';
        let game = '';
        if(this.state.players){
            game = (
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
        } else {
            overlay = this.drawOverlay(this.drawWaitingScreen());
        }

        if (this.state.is_game_over && this.state.is_overlay_open){
            overlay = this.drawOverlay(this.drawEndGameScreen());
        }
        return (
        <React.Fragment>
            <div>
                {overlay}
                {game}
            </div>
        </React.Fragment>);
    }
}

export default ViewPlayGame
