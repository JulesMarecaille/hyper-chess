import React from 'react'

class ProgressBar extends React.Component {
    state = {
    }

    getFillerBarWidth(){
        return {width: `${this.props.progression}%`,}
    }

    render() {
        return (
        <React.Fragment>
            <div class="progress-bar-container">
                <div class="filler" style={this.getFillerBarWidth()}></div>
                <span class="label">{this.props.label}</span>
            </div>
        </React.Fragment>)
    }
}

export default ProgressBar
