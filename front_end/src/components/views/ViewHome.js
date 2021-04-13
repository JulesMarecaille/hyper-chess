import React from 'react'
import { Helmet } from 'react-helmet'
import DailyReward from './rewards/DailyReward';
import { BiCoin } from 'react-icons/bi'
import { MdShowChart } from 'react-icons/md';

class ViewHome extends React.Component {
    state = {
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
                    <div class="title">Rewards</div>
                    <div class="content centered">
                        <DailyReward api={this.props.api}
                                     user={this.props.user}
                                     onUpdateUser={this.props.onUpdateUser}
                                     hasTitle={false}/>
                    </div>
                </div>

                <div class="box">
                    <div class="title">Welcome, {this.props.user.name}!</div>
                    <div class="content">

                    </div>
                </div>
            </div>
        </React.Fragment>)
    }
}

export default ViewHome
