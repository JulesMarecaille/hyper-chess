import React from 'react'
import { Helmet } from 'react-helmet'
import { Loader } from '../navigation';
import { Redirect } from 'react-router-dom';
import { ImTrophy } from 'react-icons/im';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

class ViewLeaderboard extends React.Component {
    state = {
        is_loading: true,
        users: [],
        redirect: ''
    }

    componentWillMount(){
        this.props.api.getLeaderboard().then((users) => {
            this.setState({
                users: users,
                is_loading: false
            });
        }).catch((err) => {
            this.setState({
                is_loading: false
            });
        });
    }

    redirectToProfile(user_id){
        this.setState({
            redirect: <Redirect to={`/profile?id=${user_id}`} />
        })
    }

    drawLeaderboard(){
        let leaderboard = [];
        let rank = 1
        for (let user of this.state.users){
            leaderboard.push(this.drawUser(rank, user));
            rank += 1;
        }
        return leaderboard
    }

    drawUser(rank, user){
        let is_self = '';
        let trophy = '';
        if(user.id === this.props.user.id){
            is_self = "self";
        }
        if(rank <= 3){
            trophy = <td className={`special-rank${rank}`}><ImTrophy/></td>
        } else {
            trophy = <td></td>
        }
        //
        return (
            <tr className={`entry ${is_self}`} onClick={this.redirectToProfile.bind(this, user.id)}>
                <td className="rank">{rank}</td>
                <td className="name">{user.name}</td>
                <td className="elo">{user.elo}</td>
                {trophy}
            </tr>
        );
    }

    render() {
        let loader = ''
        if(this.state.is_loading){
            loader = <Loader/>
        }
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - Leaderboard</title>
            </Helmet>
            <p>Leaderboard</p>
            {this.state.redirect}
            <PerfectScrollbar className="leaderboard-container">
                <table className="leaderboard">
                    <colgroup span="4" class="columns"></colgroup>
                    <tbody>
                        <tr className="header">
                            <th className="rank">#</th>
                            <th className="name">Name</th>
                            <th className="elo">Rating</th>
                            <th className="special-rank1"></th>
                        </tr>
                        {this.drawLeaderboard()}
                    </tbody>
                </table>
                <div class="info-container">
                    {loader}
                </div>
            </PerfectScrollbar>
        </React.Fragment>)
    }
}

export default ViewLeaderboard
