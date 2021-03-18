import React from 'react';
import { Loader } from '../navigation';

class ViewProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            is_loading: true,
            is_error: false,
            user: null,
            user_id: new URLSearchParams(this.props.search).get("id")
        }
    }

    componentWillMount(){
        this.props.api.getUser(this.state.user_id).then((user) => {
            this.setState({
                user: user,
                is_loading: false
            });
        }).catch((err) => {
            this.setState({
                is_error: true,
                is_loading: false
            });
        });
    }

    render() {
        let content = <Loader/>;
        if(!this.state.is_loading){
            content=(
                <div>
                    <div class="infos">
                        <div>
                            <div className="main">{this.state.user.name}</div>
                            <div className="secondary">Rating: {this.state.user.elo}</div>
                            <div className="secondary">Member since: {formatDate(this.state.user.created_at)}</div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
        <React.Fragment>
            <div class="profile-container">
                {content}
            </div>
        </React.Fragment>)
    }
}

function formatDate(date){
    let to_date = new Date(Date.parse(date)).toLocaleDateString()
    return to_date
}

export default ViewProfile
