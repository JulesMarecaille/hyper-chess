import React from 'react';
import { Loader } from '../navigation';

class ViewProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            is_loading: true,
            is_error: false,
            user: null,
            user_id: new URLSearchParams(this.props.search).get("id")
        }
    }

    componentWillMount(){
        this.props.api.getUserProfile(this.state.user_id).then((user) => {
            this.setState({
                user: user,
                is_loading: false
            });
        }).catch((err) => {
            this.setState({
                is_error: true,
            });
        });
    }

    drawGameResults(){
        let game_results = [];
        for(let game_result of this.state.user.game_results){
            // Score
            let results = [];
            if (game_result.draw){
                results = [0.5, 0.5]
            } else if (game_result.white_won) {
                results = [1, 0]
            } else {
                results = [0, 1]
            }
            // Self result
            let self_result;
            if(game_result.draw){
                self_result = <div className="self-result draw">Draw</div>
            } else {
                if (this.state.user.id === game_result.whiteId && game_result.white_won){
                    self_result = <div className="self-result win">Win</div>
                } else if (this.state.user.id === game_result.blackId && game_result.white_won){
                    self_result = <div className="self-result lose">Loss</div>
                } else if (this.state.user.id === game_result.blackId && !game_result.white_won) {
                    self_result = <div className="self-result win">Win</div>
                } else {
                    self_result = <div className="self-result lose">Loss</div>
                }
            }
            game_results.push(
                <div className="entry">
                    {self_result}
                    <div class="players">
                        <div className="player">
                            <div className="result">{results[0]}</div>
                            <div><div className="color white"></div></div>
                            <div className="name">{game_result.white_name}<span class="elo">({game_result.white_elo})</span></div>
                        </div>
                        <div className="player">
                            <div className="result">{results[1]}</div>
                            <div className="color black"></div>
                            <div className="name">{game_result.black_name}<span class="elo">({game_result.black_elo})</span></div>
                        </div>
                    </div>
                    <div className="date">{formatDate(game_result.created_at)}</div>
                </div>
            );
        }
        return game_results;
    }

    render() {
        let content = <Loader/>;
        if(!this.state.is_loading){
            content=(
                <div>
                    <div class="infos">
                        <div>
                            <div className="main">{this.state.user.name}</div>
                            <div className="secondary">Rating: {this.state.user.elo}</div>
                            <div className="secondary">Member since: {formatDate(this.state.user.created_at)}</div>
                        </div>
                    </div>

                    <div class="game-results">
                        <div class="title">Last games</div>
                        {this.drawGameResults()}
                    </div>
                </div>
            );
        }
        return (
        <React.Fragment>
            <div class="profile-container view-padding">
                {content}
            </div>
        </React.Fragment>)
    }
}

function formatDate(date){
    let to_date = new Date(Date.parse(date)).toLocaleDateString()
    return to_date
}

export default ViewProfile
