import React from 'react'
import { Helmet } from 'react-helmet'
import { DailyReward, Missions } from './rewards';
import { BiCoin } from 'react-icons/bi'
import { MdStar } from 'react-icons/md'
import { Loader, ProgressBar } from '../navigation'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ACHIEVEMENT_MAPPING } from 'hyperchess_model/lib/achievements';

class ViewRewards extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rewards: null,
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

    drawAchievement(achievement){
        let levels = [];
        for(let i=0; i < achievement.steps.length; i++){
            levels.push(<MdStar class={`icon ${i < achievement.getCurrentLevel() ? "" : "unselected"}`}/>)
        }
        return (
            <div class="achievement">
                <div class="title">{achievement.getLabel()}</div>
                <ProgressBar progression={(achievement.current_value/achievement.getNextStep())*100} label={`${achievement.current_value}/${achievement.getNextStep()}`}/>
                <div class="next-reward">{achievement.getNextReward()}<BiCoin className="icon"/></div>
                <div class="level">{levels}</div>
            </div>
        );
    }

    drawAllAchievements(){
        let all_achievements = [];
        for(let [achievement_name, achievement_class] of Object.entries(ACHIEVEMENT_MAPPING)){
            let achievement = new achievement_class(this.state.rewards[achievement_name]);
            all_achievements.push(this.drawAchievement(achievement));
        }
        return all_achievements;
    }

    render() {
        let all_achievements = <Loader/>
        if(this.state.rewards){
            all_achievements = this.drawAllAchievements();
        }
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - Rewards</title>
            </Helmet>
            <div className="rewards-container">
                <div class="left-panel view-padding">
                    <div class="section-title">Daily reward</div>
                    <DailyReward api={this.props.api}
                                 user={this.props.user}
                                 onUpdateUser={this.props.onUpdateUser}
                                 rewards={this.state.rewards}/>
                    <div class="section-title">Daily missions</div>
                    <Missions api={this.props.api}
                              user={this.props.user}
                              onUpdateRewards={this.handleUpdateRewards.bind(this)}
                              rewards={this.state.rewards}/>
                </div>
                <PerfectScrollbar className="achievements-container view-padding">
                    {all_achievements}
                </PerfectScrollbar>
            </div>
        </React.Fragment>)
    }
}

export default ViewRewards
