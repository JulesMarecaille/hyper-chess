import React from 'react'
import { Loader } from '../../navigation'
import { BiCoin } from 'react-icons/bi'

class DailyReward extends React.Component {
    constructor(props){
        super(props)
        this.state={
            collected: false
        }
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
        if(!this.props.rewards){
            return (
                <Loader size="small"/>
            );
        }
        if((!this.props.rewards.last_daily_coins_collected || Date.parse(this.props.rewards.last_daily_coins_collected) < new Date().setHours(0, 0, 0, 0))
            && !this.state.collected){
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
