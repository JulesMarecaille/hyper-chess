import React from 'react'
import { Link } from 'react-router-dom';
import { Loader, InfoPanel } from '../navigation';
import { validateEmail, validateUsername, validatePassword } from './login';

class ViewNewAccount extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            name: "",
            is_loading: false,
            is_error: false,
        }
        this.email_input = React.createRef();
        this.name_input = React.createRef();
        this.password_input = React.createRef();
        this.form = React.createRef();
    }

    tryCreateAccount(){
        let invalid = false;
        this.resetValidities()
        if(!validateEmail(this.state.email)){
            this.email_input.current.setCustomValidity("This is not a valid email.");
            invalid = true;
        }
        if(!validateUsername(this.state.name)){
            this.name_input.current.setCustomValidity("Your username should be at least 3 characters long and contain only letters, numbers, dash or underscores.");
            invalid = true;
        }
        if(!validatePassword(this.state.password)){
            this.password_input.current.setCustomValidity("Your password should be at least 5 characters long.");
            invalid = true;
        }
        if(!invalid){
            this.createAccount()
        }
    }

    resetValidities(){
        this.email_input.current.setCustomValidity("")
        this.name_input.current.setCustomValidity("")
        this.password_input.current.setCustomValidity("")
    }

    createAccount(){
        let payload = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }
        this.setState({
            is_loading: true,
            is_error: false
        })
        this.props.api.newUser(payload).then((res) => {
            this.props.onNewAccountSuccess();
            this.setState({
                is_loading: false,
            });
        })
        .catch((err) => {
            this.setState({
                is_loading: false,
                is_error: true,
            });
        });
    }

    handleTextTyped(evt){
        let new_state = {};
        new_state[evt.target.name] = evt.target.value;
        new_state["is_error"] = false;
        this.setState(new_state);
        this.resetValidities();
    }

    handleKeyPress(evt){
        if (evt.keyCode === 13){
            this.tryCreateAccount();
        }
    }

    componentDidMount(){
        this.form.current.addEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    render() {
        let form = <div class="center"><Loader size="large"/></div>;
        if(!this.state.is_loading){
            form = (
                <div class="form-container" ref={this.form}>
                    <InfoPanel message={`Oops! This email or this username is already in use.`} type="error" isOpen={this.state.is_error}/>
                    <div className="form-title">
                        <span className="page-title">Create a new account</span>
                        <Link to="/login">
                            <a className="alt-title text-link">Already have an account? Log In!</a>
                        </Link>
                    </div>
                    <form className="form">
                        <div className="input-container">
                            <label for="usernameInput">Username</label>
                            <input type="text" id="usernameInput" name="name" ref={this.name_input}
                            autofocus maxlength="300" value={this.state.name} onChange={this.handleTextTyped.bind(this)} required/>
                        </div>
                        <div className="input-container">
                            <label for="emailInput">Email</label>
                            <input type="email" id="emailInput" name="email" ref={this.email_input}
                            autofocus maxlength="300" value={this.state.email} onChange={this.handleTextTyped.bind(this)} required/>
                        </div>
                        <div className="input-container">
                            <label for="passwordInput">Password</label>
                            <input type="password" id="passwordInput" name="password" maxlength="300" ref={this.password_input}
                            value={this.state.password} onChange={this.handleTextTyped.bind(this)} required/>
                        </div>
                        <div className="form-buttons">
                            <input className="button" type="submit" value="Sign Up" onClick={this.tryCreateAccount.bind(this)}/>
                        </div>
                    </form>
                </div>
            )
        }
        return (
        <React.Fragment>
            <div>
                {form}
            </div>
        </React.Fragment>)
    }
}

export default ViewNewAccount
