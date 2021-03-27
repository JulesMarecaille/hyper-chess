import React from 'react'
import DailyReward from './DailyReward'

class ViewShopBrowse extends React.Component {
    constructor(props){
        super(props)
        this.state={

        }
    }

    render() {
        return (
        <React.Fragment>
            <DailyReward api={this.props.api}
                         user={this.props.user}
                         onUpdateUser={this.props.onUpdateUser}/>
        </React.Fragment>)
    }
}

export default ViewShopBrowse
