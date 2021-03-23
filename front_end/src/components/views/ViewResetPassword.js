import React from 'react'
import { Link } from 'react-router-dom';
import { Loader } from '../navigation';
import { InfoPanel } from '../navigation';
import { validateEmail, validatePassword } from './login';

class ViewResetPassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            is_loading: false,
            is_error: false,
            is_error_new: false,
            success_email: false,
            success_new: false,
            reset_token: new URLSearchParams(this.props.search).get("reset_token")
        }
        this.email_input = React.createRef();
        this.password_input = React.createRef();
        this.form = React.createRef();
    }

    resetValidities(){
        if(this.email_input.current){
            this.email_input.current.setCustomValidity("")
        }
        if(this.password_input.current){
            this.password_input.current.setCustomValidity("")
        }
    }

    tryResetPassword(){
        if(!validateEmail(this.state.email)){
            this.email_input.current.setCustomValidity("This is not a valid email.");
        } else {
            this.resetPassword();
        }
    }

    tryNewPassword(){
        if(!validatePassword(this.state.password)){
            this.password_input.current.setCustomValidity("Your password should be at least 5 characters long.");
        } else {
            this.newPassword();
        }
    }

    resetPassword(evt){
        let payload = {
            email: this.state.email,
        }
        this.setState({
            is_loading: true,
            is_error: false,
            is_error_new: false,
            success_email: false,
            success_new: false
        })
        this.props.api.resetPassword(payload).then((res) => {
            this.setState({
                is_loading: false,
                success_email: true
            });
        })
        .catch((err) => {
            this.setState({
                is_loading: false,
                is_error: true
            });
        });
    }

    newPassword(evt){
        let payload = {
            password: this.state.password,
            reset_token: this.state.reset_token,
            email: new URLSearchParams(this.props.search).get("email")
        }
        this.setState({
            is_loading: true,
            is_error: false,
            is_error_new: false,
            success_email: false,
            success_new: false
        })
        this.props.api.newPassword(payload).then((res) => {
            this.setState({
                is_loading: false,
                success_new: true
            });
        })
        .catch((err) => {
            this.setState({
                is_loading: false,
                is_error_new: true
            });
        });
        this.props.onNewPassword();
    }

    handleTextTyped(evt){
        this.resetValidities();
        let new_state = {};
        new_state[evt.target.name] = evt.target.value
        new_state["is_error"] = false;
        this.setState(new_state);
    }

    handleKeyPress(evt){
        if (evt.keyCode === 13 && !this.state.success_email){
            if(this.state.reset_token == null){
                this.tryResetPassword();
            } else {
                this.tryNewPassword();
            }
        }
    }

    componentDidMount(){
        this.form.current.addEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    render() {
        let content = <div class="center"><Loader size="large"/></div>;
        let form;
        let submit_reset = '';
        if(!this.state.success_email){
            submit_reset = (
                <div className="form-buttons">
                    <input className="button" type="submit" value="Send the reset email" onClick={this.tryResetPassword.bind(this)}/>
                </div>
            );
        }
        if(this.state.reset_token == null) {
            form = (
                <form className="form">
                    <div className="input-container">
                        <label for="emailInput">Email</label>
                        <input type="email" id="emailInput" name="email" ref={this.email_input}
                        autofocus maxlength="300" value={this.state.email} onChange={this.handleTextTyped.bind(this)} required/>
                    </div>
                    {submit_reset}
                </form>
            );
        } else {
            form = (
                <div className="form">
                    <div className="input-container">
                        <label for="passwordInput">New password</label>
                        <input type="password" id="passwordInput" name="password" ref={this.password_input}
                        autofocus maxlength="300" value={this.state.password} onChange={this.handleTextTyped.bind(this)} required/>
                    </div>
                    <div className="form-buttons">
                        <input className="button" type="submit" value="Reset your password" onClick={this.tryNewPassword.bind(this)}/>
                    </div>
                </div>
            );
        }
        if (!this.state.is_loading) {
            content = (
                <div class="form-container" ref={this.form}>
                    <InfoPanel message="Oops! An error occured." type="error" isOpen={this.state.is_error}/>
                    <InfoPanel message="Oops! An error occured." type="error" isOpen={this.state.is_error_new}/>
                    <InfoPanel message="The email has been sent! Check your inbox." type="success" isOpen={this.state.success_email}/>
                    <InfoPanel message="Your password has been changed!" type="success" isOpen={this.state.success_new}/>
                    <div className="form-title">
                        <span className="page-title">Reset your password</span>
                        <Link to="/login">
                            <a className="alt-title text-link">Trying to log in?</a>
                        </Link>
                    </div>
                    {form}
                </div>
            );
        }
        return (
        <React.Fragment>
            <div>
                {content}
            </div>
        </React.Fragment>)
    }
}

export default ViewResetPassword
