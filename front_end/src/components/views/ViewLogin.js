import React from 'react'
import { Link } from 'react-router-dom';
import { Loader } from '../navigation';
import { InfoPanel } from '../navigation'

class ViewLogin extends React.Component {
    state = {
        email: "",
        password: "",
        is_loading: false,
        is_error: false
    }

    tryLogin(evt){
        let payload = {
            email: this.state.email,
            password: this.state.password
        }
        this.setState({
            is_loading: true,
            is_error: false
        })
        this.props.api.login(payload).then((res) => {
            this.props.onLoginSuccess(res.user, res.token);
            this.setState({
                is_loading: false
            });
        })
        .catch((err) => {
            this.setState({
                is_loading: false,
                is_error: true
            });
        });
    }

    handleTextTyped(evt){
        let new_state = {};
        new_state[evt.target.name] = evt.target.value
        new_state["is_error"] = false;
        this.setState(new_state);
    }

    handleKeyPress(evt){
        if (evt.keyCode === 13){
            this.tryLogin();
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.handleKeyPress.bind(this), false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    render() {
        let form = <div class="center"><Loader size="large"/></div>;
        if (!this.state.is_loading) {
            form = (
                <div class="form-container">
                    <InfoPanel message="Oops! Wrong email or password." type="error" isOpen={this.state.is_error}/>
                    <div className="form-title">
                        <span className="page-title">Login</span>
                        <Link to="/newAccount">
                            <a className="alt-title text-link">No account yet? Sign Up!</a>
                        </Link>
                    </div>
                    <div className="form">
                        <div className="input-container">
                            <label for="emailInput">Email</label>
                            <input type="text" id="emailInput" name="email"
                            autofocus maxlength="300" value={this.state.email} onChange={this.handleTextTyped.bind(this)}/>
                        </div>
                        <div className="input-container">
                            <label for="passwordInput">Password</label>
                            <input type="password" id="passwordInput" name="password" maxLength="300"
                            value={this.state.password} onChange={this.handleTextTyped.bind(this)}/>
                        </div>
                        <div className="form-buttons">
                            <input className="button" type="submit" value="Login" onClick={this.tryLogin.bind(this)}/>
                        </div>
                    </div>
                </div>
            );
        }
        return (
        <React.Fragment>
            <div>
                {form}
            </div>
        </React.Fragment>)
    }
}

export default ViewLogin
