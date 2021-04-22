import React from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { DailyReward, Missions } from './rewards';
import PlayStats from './play/PlayStats';
import { BiCoin } from 'react-icons/bi'
import { MdShowChart } from 'react-icons/md';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

class ViewHome extends React.Component {
    constructor(props){
        super(props);
        this.state={
            rewards: null
        }
    }

    componentWillMount(){
        this.props.api.getUserRewards(this.props.user.id).then((rewards) => {
            this.setState({
                rewards: rewards
            })
        }).catch((err) => {
        });
    }

    handleUpdateRewards(rewards){
        this.setState({
            rewards: rewards
        })
    }

    render() {
        let img = process.env.PUBLIC_URL + '/assets/logos/logo_icon_light.svg';
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - Home</title>
            </Helmet>
            <div className="home-container">
                <img src={img} className="background"></img>

                <div class="box">
                    <div class="title">Welcome, {this.props.user.name}!</div>
                    <div class="content">
                        <div>
                            <div className="sub green">
                                <MdShowChart className="icon"/>
                                <span className="name">{this.props.user.elo}</span>
                            </div>
                            <div className="sub coins">
                                <BiCoin className="icon"/>
                                <span className="name">{this.props.user.coins}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="box">
                    <div class="title">Play</div>
                    <div class="content">
                        <PlayStats/>
                        <div class="button-container">
                            <Link to="/play" data-tip="Play">
                                <div className="button flat">
                                    Play
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div class="box">
                    <div class="title">Daily reward</div>
                    <div class="content centered">
                        <DailyReward api={this.props.api}
                                     user={this.props.user}
                                     onUpdateUser={this.props.onUpdateUser}
                                     rewards={this.state.rewards}
                                     hasTitle={false}/>
                    </div>
                </div>

                <div class="box">
                    <div class="title">Daily missions</div>
                    <div class="content centered">
                        <Missions api={this.props.api}
                                     user={this.props.user}
                                     onUpdateRewards={this.handleUpdateRewards.bind(this)}
                                     rewards={this.state.rewards}/>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }
}

export default ViewHome
