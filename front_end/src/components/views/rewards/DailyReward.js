import React from 'react'
import { Loader } from '../../navigation'
import { BiCoin } from 'react-icons/bi'

class DailyReward extends React.Component {
    constructor(props){
        super(props)
        this.state={
            loading: true,
            last_daily_coins_collected: null,
            collected: false
        }
    }

    componentWillMount(){
        this.props.api.getUserRewards(this.props.user.id).then((rewards) => {
            this.setState({
                last_daily_coins_collected: rewards.last_daily_coins_collected,
                loading: false
            })
        }).catch((err) => {
        });
    }

    collectReward(){
        this.setState({
            collected: true
        });
        this.props.api.collectDailyReward().then(() => {
            this.props.onUpdateUser();
        })
    }

    drawDailyReward(){
        if(this.state.loading){
            return (
                <Loader size="small"/>
            );
        }
        if(Date.parse(this.state.last_daily_coins_collected) < new Date().setHours(0, 0, 0, 0) && !this.state.collected){
            return (
                <div class="button gold daily-reward" onClick={this.collectReward.bind(this)}>
                    <span>+50 <BiCoin class="icon"/></span>
                </div>
            )
        }
        return (
            <div class="button disabled flat daily-reward">
                <span>Come back tomorrow for more!</span>
            </div>
        )
    }

    render() {
        let title="";
        if(this.props.hasTitle){
            let title = <span class="title">Daily Reward</span>;
        }
        return (
        <React.Fragment>
            <div class="daily-reward-container">
            {this.drawDailyReward()}
            </div>
        </React.Fragment>)
    }
}

export default DailyReward
