import './App.css';
import React from 'react'
import { LeftMenu, Loader } from './components/navigation';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ViewDecks, ViewGame, ViewHome, ViewShop, ViewLogin, ViewNewAccount} from './components/views';
import HyperChessAPI from './connection/HyperChessAPI.js';
import Cookies from 'universal-cookie';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            api: new HyperChessAPI("http://localhost:5000/", ""),
            user: null,
            new_account_created: false
        };
    }

    componentDidMount(){
        const cookies = new Cookies();
        const user = cookies.get('HyperChessUser');
        const token = cookies.get('HyperChessToken');
        if (user && token){
            this.setState({
                user: user
            })
            this.state.api.setToken(token);
        }
    }

    handleLogin(user, token){
        this.setState({
            user: user
        })
        this.state.api.setToken(token);
        const cookies = new Cookies();
        //The cookies expires in 30 days
        cookies.set('HyperChessUser', user, { path: '/', expires: new Date(Date.now()+2592000) });
        cookies.set('HyperChessToken', token, { path: '/', expires: new Date(Date.now()+2592000) });
    }

    handleLogout(){
        const cookies = new Cookies();
        cookies.remove('HyperChessUser', { path: '/' });
        cookies.remove('HyperChessToken', { path: '/' });
        this.setState({
            user: null
        })
        this.state.api.setToken("")
    }

    handleNewAccount(){
        window.location.href = "login";
        this.setState({
            new_account_created: true
        });
    }

    render(){
        let app = (
            <div className="login-container">
                <div className="left-panel">
                    <Loader />
                </div>
                <div className="right-panel">
                    <Switch>
                        <Route exact path='/login'
                               render={() => (<ViewLogin api={this.state.api}
                                                         onLoginSuccess={this.handleLogin.bind(this)}/>
                                             )}>
                        </Route>onNewAccountSuccess
                        <Route exact path='/newAccount'
                               render={() => (<ViewNewAccount api={this.state.api}
                                                              onNewAccountSuccess={this.handleNewAccount.bind(this)}/>
                                             )}>
                        </Route>
                        <Route render={() => <Redirect to="/login" />} />
                    </Switch>
                </div>
            </div>
        );
        // check if an user is logged
        if (this.state.user){
            app = (
                <div>
                    <LeftMenu onLogout={this.handleLogout.bind(this)}/>
                    <div className="view-container">
                        <Switch>
                            <Route exact path='/home' component={ViewHome}></Route>
                            <Route exact path='/game' component={ViewGame}></Route>
                            <Route exact path='/decks' component={ViewDecks}></Route>
                            <Route exact path='/shop' component={ViewShop}></Route>
                            <Route render={() => <Redirect to="/home" />} />
                        </Switch>
                    </div>
                </div>
            );
        }
        return (
            <Router>
                <div className="App">
                    {app}
                </div>
            </Router>
        );
    }
}

export default App;
