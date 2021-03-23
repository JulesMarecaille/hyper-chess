import React from 'react'
import ReactTooltip from 'react-tooltip';
import Game from '../../../chess/ui/Game.js'
import Clock from '../../../chess/ui/Clock.js'
import { Loader } from '../../navigation'
import { MdFlag, MdClose, MdCheck } from 'react-icons/md'
import { FaRegHandshake } from 'react-icons/fa'
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
            is_overlay_open: true,
            time_remaining: {},
            color_to_move: WHITE,
            nb_half_moves: 0,
            game_over_reason : "",
            elo_differences: null,
            player_offer_draw: false,
            opponent_offer_draw: false,
            player_rejected_offer: false,
            player_clicked_resign: false
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
                time_remaining: data.time_remaining
            });
            this.game_start_sound.play()
        })

        socket.on("gameOver", (data) => {
            this.setState({
                winner: data.winner,
                is_game_over: true,
                time_remaining: data.time_remaining,
                game_over_reason: data.reason,
                elo_differences: data.elo_differences
            })
            this.game_end_sound.play()
            if (data.elo_differences){
                for(const [color, player] of Object.entries(this.state.players)){
                    this.state.players[color].elo = this.state.players[color].elo + data.elo_differences[color];
                }
                this.props.onUpdateUser()
            }
        });

        socket.on("opponentOfferDraw", () => {
            this.setState({
                opponent_offer_draw: true
            })
        })
    }

    componentWillUnmount(){
        this.props.onExitGame();
        socket.removeAllListeners("startGame");
        socket.removeAllListeners("gameOver");
    }

    drawEndGameScreen(){
        let box_title;
        if(this.state.winner == null){
            let title = "Draw";
            if(this.state.nb_half_moves < 2){
                title = "Canceled";
            }
            box_title = (<div className="title grey">
                            <div>
                                <span class="main">{title}</span>
                                <span class="sub">{this.state.game_over_reason}</span>
                            </div>
                        </div>);
        } else if (this.state.winner === this.state.side){
            box_title = (<div className="title green">
                            <div>
                                <span class="main">You won</span>
                                <span class="sub">{this.state.game_over_reason}</span>
                            </div>
                        </div>);
        } else {
            box_title = (<div className="title grey">
                            <div>
                                <span class="main">You lost</span>
                                <span class="sub">{this.state.game_over_reason}</span>
                            </div>
                        </div>);
        }
        let update_elo = '';
        if(this.state.elo_differences){
            let elo_difference = this.state.elo_differences[this.state.side];
            let elo_difference_el;
            if(elo_difference > 0){
                elo_difference_el = <span class="difference positive">+{elo_difference}</span>
            } else if (elo_difference < 0){
                elo_difference_el = <span class="difference negative">{elo_difference}</span>
            } else {
                elo_difference_el = <span class="difference">+0</span>
            }
            update_elo = (
                <div class="update-elo">
                    <span class="rating">New rating</span>
                    <span><span class="previous">{this.state.players[this.state.side].elo}</span>({elo_difference_el})</span>
                </div>);
        }
        return (
            <div class="box">
                {box_title}
                <div className="content">
                    {update_elo}
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

    drawPlayerInfo(player, color){
        let player_info = (
            <div class="player-info">
                <div className="name-elo">
                    <span className="name">{player.name}</span>
                    <span className="elo">({player.elo})</span>
                </div>
                <Clock color={color}
                       time={this.state.time_remaining[color]}
                       is_running={!this.state.is_game_over &&
                                   color === this.state.color_to_move &&
                                   this.state.nb_half_moves >= 2}
                />
            </div>
        );
        return player_info;
    }

    drawActionInterface(){
        let actions;
        if(!this.state.player_offer_draw && !this.state.opponent_offer_draw){
            if(this.state.player_clicked_resign){
                actions =  (
                    <div>
                        <div className="info">Are you sure you want to resign?</div>
                        <div class="actions">
                            <ReactTooltip place="bottom" delayShow="600" effect="solid"/>
                            <div className="action green" onClick={this.resign.bind(this)} data-tip="Resign"><MdCheck/></div>
                            <div className="action red" onClick={this.toggleResign.bind(this)} data-tip="Cancel"><MdClose/></div>
                        </div>
                    </div>
                );
            } else {
                actions = (
                    <div class="actions">
                        <ReactTooltip place="bottom" delayShow="600" effect="solid"/>
                        <div className="action" onClick={this.toggleResign.bind(this)} data-tip="Resign"><MdFlag/></div>
                        <div className="action" onClick={this.proposeDraw.bind(this)} data-tip="Offer draw"><FaRegHandshake/></div>
                    </div>
                );
            }
        } else if(this.state.player_offer_draw) {
            actions = <div className="info">You offered a draw.</div>;
        } else {
            if(!this.state.player_rejected_offer){
                actions = (
                    <div>
                        <div className="info">Opponent offered a draw.</div>
                        <div class="actions">
                            <ReactTooltip place="bottom" delayShow="600" effect="solid"/>
                            <div className="action green" onClick={this.acceptDrawOffer.bind(this)} data-tip="Accept draw"><MdCheck/></div>
                            <div className="action red" onClick={this.rejectDrawOffer.bind(this)} data-tip="Refuse draw"><MdClose/></div>
                        </div>
                    </div>
                );
            } else {
                actions = <div className="info">You rejected the offer for a draw.</div>;
            }
        }
        return (
            <div className="actions-container">
                {actions}
            </div>
        );
    }

    proposeDraw(){
        this.setState({
            player_offer_draw: true
        })
        socket.emit("proposeDraw", {game_id: this.props.game_id, color: this.state.side});
    }

    acceptDrawOffer(){
        socket.emit("acceptDraw", {game_id: this.props.game_id, color: this.state.side});
    }

    rejectDrawOffer(){
        this.setState({
            player_rejected_offer: true
        });
    }

    toggleResign(){
        this.setState({
            player_clicked_resign: !this.state.player_clicked_resign
        })
    }

    resign(){
        socket.emit("playerResign", {game_id: this.props.game_id, color: this.state.side})
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

    handlePlayerMoved(time_remaining=null){
        if (time_remaining){
            this.setState({
                time_remaining: time_remaining,
            });
        }
        this.setState({
            color_to_move: swapColor(this.state.color_to_move),
            nb_half_moves: this.state.nb_half_moves + 1,
            player_offer_draw: false,
            opponent_offer_draw: false,
            player_rejected_offer: false
        });
    }

    render() {
        let overlay = '';
        let game = '';
        if(this.state.players){
            game = (
                <div>
                    <div className="chess-board-container">
                        {this.state.side === BLACK ? this.drawPlayerInfo(this.state.players[WHITE], WHITE) : this.drawPlayerInfo(this.state.players[BLACK], BLACK)}
                        <Game side={this.state.side}
                              game_id={this.props.game_id}
                              whitePlayer={this.state.players[WHITE]}
                              blackPlayer={this.state.players[BLACK]}
                              whiteDeck={createClassicDeck()}
                              blackDeck={createClassicDeck()}
                              onGameOver={this.handleGameOver.bind(this)}
                              onPlayerMoved={this.handlePlayerMoved.bind(this)}
                        />
                        {this.state.side === BLACK ? this.drawPlayerInfo(this.state.players[BLACK], BLACK) : this.drawPlayerInfo(this.state.players[WHITE], WHITE)}
                    </div>
                    {this.drawActionInterface()}
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
