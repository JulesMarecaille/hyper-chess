import React from 'react'
import ReactTooltip from 'react-tooltip';
import { Game, Clock } from '../../chess'
import { Loader } from '../../navigation'
import { MdFlag, MdClose, MdCheck } from 'react-icons/md'
import { FaRegHandshake } from 'react-icons/fa'
import { BiCoin } from 'react-icons/bi'
import { Deck } from 'hyperchess_model/lib'
import { WHITE, BLACK, swapColor } from 'hyperchess_model/lib/constants';
import { socket } from '../../../connection/socket';

class ViewPlayGame extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            is_game_over: false,
            winner: null,
            side: null,
            players: null,
            decks: null,
            is_overlay_open: true,
            time_remaining: {},
            color_to_move: WHITE,
            nb_half_moves: 0,
            game_over_reason : "",
            elo_differences: null,
            coins_won: null,
            player_offer_draw: false,
            opponent_offer_draw: false,
            opponent_declined_rematch: false,
            opponent_offer_rematch: false,
            can_offer_rematch: true,
            offered_rematch: false,
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
                decks: data.decks,
                time_remaining: data.time_remaining,
                is_game_over: false,
                is_overlay_open: true,
                color_to_move: WHITE,
                nb_half_moves: 0,
                game_over_reason : "",
                elo_differences: null,
                coins_won: null,
                player_offer_draw: false,
                opponent_offer_draw: false,
                opponent_declined_rematch: false,
                opponent_offer_rematch: false,
                can_offer_rematch: true,
                offered_rematch: false,
                player_rejected_offer: false,
                player_clicked_resign: false,
                opponent_disconnected: false
            });
            this.game_start_sound.play()
            this.disconnection_interval_obj = null;
        })

        socket.on("gameOver", (data) => {
            console.log(data)
            this.setState({
                winner: data.winner,
                is_game_over: true,
                time_remaining: data.time_remaining,
                game_over_reason: data.reason,
                elo_differences: data.elo_differences,
                coins_won: data.coins_won
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

        socket.on("opponentOfferRematch", () => {
            this.setState({
                opponent_offer_rematch: true
            })
        })

        socket.on("opponentDeclineRematch", () => {
            this.setState({
                opponent_declined_rematch: true
            })
        })

        socket.on("opponentDisconnected", () => {
            this.setState({
                opponent_disconnected: true
            })
            this.setState({
                time_before_win_by_disconnection: 30
            })
            if(!this.disconnection_interval_obj){
                this.disconnection_interval_obj = setInterval(() => {
                    if(this.state.time_before_win_by_disconnection > 0){
                        this.setState({
                            time_before_win_by_disconnection: this.state.time_before_win_by_disconnection - 1
                        })
                    } else {
                        clearInterval(this.disconnection_interval_obj);
                    }
                }, 1000)
            }
        })

        socket.on("opponentReconnected", () => {
            this.setState({
                opponent_disconnected: false
            })
            if(this.disconnection_interval_obj){
                clearInterval(this.disconnection_interval_obj);
                this.disconnection_interval_obj = null;
            }
        })

        if(this.props.reconnectionData){
            let data = this.props.reconnectionData;
            let side = BLACK;
            if (data.players[WHITE].id === this.props.user.id){
                side = WHITE;
            }
            data.side = side;
            this.setState(data)
            this.game_start_sound.play()
        }
    }

    handleOfferRematch(){
        this.setState({
            can_offer_rematch: false,
            offered_rematch: true
        })
        socket.emit("offerRematch", {game_id: this.props.game_id});
    }

    handleAcceptRematch(){
        socket.emit("acceptRematch", {game_id: this.props.game_id});
    }

    handleDeclineRematch(){
        socket.emit("declineRematch", {game_id: this.props.game_id});
        this.setState({
            opponent_offer_rematch: false,
            can_offer_rematch: false
        })
    }

    componentWillUnmount(){
        this.props.onExitGame();
        socket.removeAllListeners("startGame");
        socket.removeAllListeners("gameOver");
        socket.removeAllListeners("reconnectToGame");
        socket.removeAllListeners("opponentOfferDraw");
        socket.removeAllListeners("opponentOfferRematch");
        socket.removeAllListeners("opponentDeclineRematch");
        socket.removeAllListeners("opponentDisconnected");
        socket.removeAllListeners("opponentReconnected");
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
                elo_difference_el = <span class="difference positive">(+{elo_difference})</span>
            } else if (elo_difference < 0){
                elo_difference_el = <span class="difference negative">({elo_difference})</span>
            } else {
                elo_difference_el = <span class="difference">(+0)</span>
            }
            update_elo = (
                <div class="update">
                    <span class="update-title">New rating</span>
                    <span class="info"><span class="">{this.state.players[this.state.side].elo}</span>{elo_difference_el}</span>
                </div>);
        }
        let update_coins = '';
        if(this.state.coins_won && this.state.coins_won[this.state.side] > 0){
            update_coins = (
                <div class="update">
                    <span class="update-title">Coins collected</span>
                    <span class="info"><span class="info">+{this.state.coins_won[this.state.side]}</span><BiCoin class="icon-coin"/></span>
                </div>
            );
        } else if (this.state.winner === this.state.side){
            update_coins = (
                <div class="update">
                    <span class="limit">You've reach the maximum number of coins you can win today</span>
                </div>
            );
        }
        let rematch_infos = '';
        if (this.state.opponent_offer_rematch){
            rematch_infos = <div class="rematch-infos">Your opponent offered a rematch.</div>
        } else if (this.state.opponent_declined_rematch) {
            rematch_infos = <div class="rematch-infos">Your opponent declined your offer for a rematch.</div>
        } else if (this.state.offered_rematch){
            rematch_infos = <div class="rematch-infos">You offered your opponent a rematch.</div>
        }
        let rematch_button = ''
        if(this.state.can_offer_rematch && this.state.elo_differences && !this.state.opponent_disconnected){
            rematch_button = <button class="button" onClick={this.handleOfferRematch.bind(this)}>Offer rematch</button>
        }

        let actions = '';
        if(!this.state.opponent_offer_rematch){
            actions = (
                <div class="button-container">
                    <button class="button" onClick={this.props.onExitGame}>Back to Lobby</button>
                    {rematch_button}
                </div>
            )
        } else {
            actions = (
                <div class="button-container">
                    <button class="button" onClick={this.handleAcceptRematch.bind(this)}>Accept</button>
                    <button class="button" onClick={this.handleDeclineRematch.bind(this)}>Decline</button>
                </div>
            )
        }
        return (
            <div class="box">
                {box_title}
                <div className="content">
                    {update_elo}
                    {update_coins}
                    {rematch_infos}
                    {actions}
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
        if(this.state.is_game_over){ return ""; }
        let actions;
        if(this.state.opponent_disconnected){
            actions = (
                <div>
                    <div className="info">Your opponent left. You will win in {this.state.time_before_win_by_disconnection} seconds.</div>
                </div>
            )
        } else if(!this.state.player_offer_draw && !this.state.opponent_offer_draw){
            if(this.state.player_clicked_resign){
                actions = (
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
        socket.emit("playerResign", {game_id: this.props.game_id})
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
        if(this.state.side !== null){
            game = (
                <div>
                    <div className="chess-board-container">
                        {this.state.side === BLACK ? this.drawPlayerInfo(this.state.players[WHITE], WHITE) : this.drawPlayerInfo(this.state.players[BLACK], BLACK)}
                        <Game side={this.state.side}
                              game_id={this.props.game_id}
                              reconnectionData={this.props.reconnectionData}
                              whitePlayer={this.state.players[WHITE]}
                              blackPlayer={this.state.players[BLACK]}
                              whiteDeck={Deck.buildFromPayload(this.state.decks[WHITE])}
                              blackDeck={Deck.buildFromPayload(this.state.decks[BLACK])}
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
