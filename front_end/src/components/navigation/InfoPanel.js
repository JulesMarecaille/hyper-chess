import React from 'react'
import { MdClose } from 'react-icons/md';

class InfoPanel extends React.Component {
    state = {
        is_open: this.props.isOpen
    }

    close(){
        this.setState({
            is_open: false
        })
    }

    render() {
        return (
        <React.Fragment>
        <div class={`info-panel ${this.state.is_open ? "open" : "close"} ${this.props.type}`}>
            <span class="message">{this.props.message}</span>
            <MdClose onClick={this.close.bind(this)} class="close"/>
        </div>
        </React.Fragment>)
    }
}

export default InfoPanel
