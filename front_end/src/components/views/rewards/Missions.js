import React from 'react'
import { Loader, ProgressBar } from '../../navigation'
import { BiCoin } from 'react-icons/bi'
import { MISSION_MAPPING } from 'hyperchess_model/lib/missions';

class Missions extends React.Component {
    constructor(props){
        super(props)
        this.state={
            is_loading: false
        }
    }

    getNewMission(){
        this.setState({
            is_loading: true
        })
        this.props.api.getNewMission().then((rewards) => {
            this.props.onUpdateRewards(rewards);
            this.setState({
                is_loading: false
            })
        }).catch((err) => {})
    }

    drawAllMissions(){
        let missions = [];
        if(!this.props.rewards || this.state.is_loading){
            return (
                <Loader size="medium"/>
            );
        }
        if(this.props.rewards.mission_1_name){
            missions.push(this.drawMission(this.props.rewards.mission_1_name, this.props.rewards.mission_1_value));
        }
        if(this.props.rewards.mission_2_name){
            missions.push(this.drawMission(this.props.rewards.mission_2_name, this.props.rewards.mission_2_value));
        }
        if(this.props.rewards.mission_3_name){
            missions.push(this.drawMission(this.props.rewards.mission_3_name, this.props.rewards.mission_3_value));
        }

        if((!this.props.rewards.last_new_mission || Date.parse(this.props.rewards.last_new_mission) < new Date().setHours(0, 0, 0, 0))
            && missions.length < 3){
            missions.push(<div class="new-mission" onClick={this.getNewMission.bind(this)}>New mission</div>)
        }

        if(missions.length === 0){
            missions.push(<div class="button disabled flat no-mission">Come back tomorrow for more!</div>)
        }
        return missions;
    }

    drawMission(mission_name, mission_value){
        let mission = new MISSION_MAPPING[mission_name](mission_value);
        return (
            <div class="mission" key={mission_name + mission_value}>
                <div class="title"><span class="reward">{mission.reward} <BiCoin class="icon"/></span>{mission.label}</div>
                <ProgressBar progression={(mission.current_value/mission.goal) * 100} label={`${mission.current_value}/${mission.goal}`}/>
            </div>
        );
    }

    render() {
        return (
        <React.Fragment>
            <div class="missions-container">
            {this.drawAllMissions()}
            </div>
        </React.Fragment>)
    }
}

export default Missions
