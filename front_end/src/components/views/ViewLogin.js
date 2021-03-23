import React from 'react'
import { Link } from 'react-router-dom';
import { Loader } from '../navigation';
import { InfoPanel } from '../navigation';
import { validateEmail } from './login';

class ViewLogin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: new URLSearchParams(this.props.search).get("email"),
            password: "",
            is_loading: false,
            is_error: false,
            password_reset: this.props.passwordReset,
            new_account_created: this.props.newAccountCreated
        }
        this.email_input = React.createRef();
        this.form = React.createRef();
    }

    tryLogin(){
        if(!validateEmail(this.state.email)){
            this.email_input.current.setCustomValidity("This is not a valid email.");
        } else {
            this.login();
        }
    }

    resetValidities(){
        this.email_input.current.setCustomValidity("")
    }

    login(){
        let payload = {
            email: this.state.email,
            password: this.state.password
        }
        this.setState({
            is_loading: true,
            is_error: false,
            password_reset: false,
            new_account_created: false
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
        this.resetValidities();
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
        this.form.current.addEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    render() {
        let form = <div class="center"><Loader size="large"/></div>;
        if (!this.state.is_loading) {
            form = (
                <div class="form-container" ref={this.form}>
                    <InfoPanel message="Oops! Wrong email or password." type="error" isOpen={this.state.is_error}/>
                    <InfoPanel message="Account created successfully! Log in now" type="success" isOpen={this.state.new_account_created}/>
                    <InfoPanel message="Your password has been reset! Log in now" type="success" isOpen={this.state.password_reset}/>
                    <div className="form-title">
                        <span className="page-title">Login</span>
                        <Link to="/signup">
                            <a className="alt-title text-link">No account yet? Sign Up!</a>
                        </Link>
                    </div>
                    <form className="form">
                        <div className="input-container">
                            <label for="emailInput">Email</label>
                            <input type="email" id="emailInput" name="email" ref={this.email_input}
                            autofocus maxlength="300" value={this.state.email} onChange={this.handleTextTyped.bind(this)} required invalid/>
                        </div>
                        <div className="input-container">
                            <label for="passwordInput">Password</label>
                            <input type="password" id="passwordInput" name="password" maxLength="300"
                            value={this.state.password} onChange={this.handleTextTyped.bind(this)} required/>
                            <Link to="/reset">
                                <a className="text-link">Forgot your password?</a>
                            </Link>
                        </div>
                        <div className="form-buttons">
                            <input className="button" type="submit" value="Login" onClick={this.tryLogin.bind(this)}/>
                        </div>
                    </form>
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
