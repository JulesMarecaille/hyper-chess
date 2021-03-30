import React from 'react'
import { WHITE } from '../model/constants.js'
import {
    WiTime1,
    WiTime2,
    WiTime3,
    WiTime4,
    WiTime5,
    WiTime6,
    WiTime7,
    WiTime8,
    WiTime9,
    WiTime10,
    WiTime11,
    WiTime12
} from 'react-icons/wi';
const TICK = 1000;
const CLOCK_ICONS = [
    <WiTime12/>,
    <WiTime11/>,
    <WiTime10/>,
    <WiTime9/>,
    <WiTime8/>,
    <WiTime7/>,
    <WiTime6/>,
    <WiTime5/>,
    <WiTime4/>,
    <WiTime3/>,
    <WiTime2/>,
    <WiTime1/>
]

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: this.props.time
        }
        this.interval_obj = null
    }

    drawTime(){
        // Get time in seconds
        let time = this.state.time / 1000 ;

        // Cut it in minutes & seconds
        let minutes = Math.floor(time / 60);
        let minutes_str;
        if (minutes < 10) {
            minutes_str = "0" + minutes;
        } else {
            minutes_str = minutes;
        }

        let seconds = Math.round((time - (minutes * 60)));
        let seconds_str;
        if (seconds === 60) {
            seconds_str = "00";
            minutes_str = minutes + 1;
        } else if (seconds < 10) {
            seconds_str = "0" + seconds;
        } else {
            seconds_str = seconds;
        }
        let clock_icon_index = Math.floor(seconds / 5);
        let is_stopped_class = this.props.is_running ? "" : "stopped"
        return (
            <div className={`clock-container unselectable ${this.props.color === WHITE ? 'white' : 'black'} ${is_stopped_class}`}>
                <span class="icon">{CLOCK_ICONS[clock_icon_index]}</span>
                <div class="time">
                    <span class="minutes">{minutes_str}</span>
                    <span class="separator">:</span>
                    <span class="seconds">{seconds_str}</span>
                </div>
            </div>
        );
    }

    updateStates(){
        // If the clock is running
        if(this.props.is_running){
            // And we don't have an interval object yet
            if(!this.interval_obj){
                // Update every tick
                this.interval_obj = setInterval(() => {
                    this.setState({
                        time: this.state.time - TICK
                    });
                    //If the time is 0 we stop the interval object
                    if(this.state.time <= 0){
                        this.setState({
                            time: 0
                        });
                        clearInterval(this.interval_obj)
                    }
                }, TICK)
            }
        } else {
            if(this.state.time !== this.props.time){
                // We update the time with data from the server
                this.setState({
                    time: this.props.time
                })
            }
            if(this.interval_obj){
                clearInterval(this.interval_obj)
                this.interval_obj = null;
            }
        }
    }

    render() {
        this.updateStates();
        return (
        <React.Fragment>
            {this.drawTime()}
        </React.Fragment>)
    }

}

export default Clock
