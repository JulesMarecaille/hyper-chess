import './App.css';
import React from 'react'
import { LeftMenu, Loader } from './components/navigation';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import {
    ViewDecks,
    ViewPlay,
    ViewHome,
    ViewShop,
    ViewLogin,
    ViewNewAccount,
    ViewResetPassword,
    ViewCollection,
    ViewProfile,
    ViewLeaderboard
} from './components/views';
import HyperChessAPI from './connection/HyperChessAPI.js';
import Cookies from 'universal-cookie';
import { socket, initSocket } from './connection/socket';
import { withRouter } from 'react-router-dom';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            api: new HyperChessAPI("http://localhost:5000/", ""),
            user: null,
            new_account_created: false,
            token: null,
            location: ""
        };
    }

    componentDidMount(){
        const cookies = new Cookies();
        const user = cookies.get('HyperChessUser');
        const token = cookies.get('HyperChessToken');
        if (user && token){
            this.setState({
                user: user,
                token: token
            })
            this.state.api.setToken(token);
            initSocket(token)
        }
    }

    handleLogin(user, token){
        this.setState({
            user: user,
            token: token
        })
        this.state.api.setToken(token);
        const cookies = new Cookies();
        //The cookies expires in 30 days
        cookies.set('HyperChessUser', user, { path: '/', expires: new Date(Date.now()+2592000) });
        cookies.set('HyperChessToken', token, { path: '/', expires: new Date(Date.now()+2592000) });
        initSocket(token)
    }

    handleLogout(){
        const cookies = new Cookies();
        cookies.remove('HyperChessUser', { path: '/' });
        cookies.remove('HyperChessToken', { path: '/' });
        this.setState({
            user: null,
            token: null
        })
        this.state.api.setToken("")
    }

    handleNewAccount(){
        this.setState({
            new_account_created: true,
            redirect_to_login: <Redirect to="/login"/>
        });
    }

    handlePasswordReset(){
        this.setState({
            password_reset: true,
            redirect_to_login: <Redirect to="/login"/>
        });
    }

    handleUpdateUser(){
        this.state.api.getUser(this.state.user.id).then((user) => {
            this.setState({
                user: user
            })
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
                               render={(props) => (<ViewLogin api={this.state.api}
                                                         newAccountCreated={this.state.new_account_created}
                                                         passwordReset={this.state.password_reset}
                                                         onLoginSuccess={this.handleLogin.bind(this)}
                                                         search={props.location.search}/>
                                             )}>
                        </Route>
                        <Route exact path='/signup'
                               render={() => (<ViewNewAccount api={this.state.api}
                                                              onNewAccountSuccess={this.handleNewAccount.bind(this)}/>
                                             )}>
                        </Route>
                        <Route exact path="/reset" render={(props) => (<ViewResetPassword api={this.state.api}
                                                                                          search={props.location.search}
                                                                                          onNewPassword={this.handlePasswordReset.bind(this)}
                                                                        />
                                                             )}></Route>
                        <Route render={() => <Redirect to="/login" />} />
                    </Switch>
                </div>
            </div>
        );
        // check if an user is logged
        if (this.state.user){
            app = (
                <div>
                    <LeftMenu onLogout={this.handleLogout.bind(this)}
                              user={this.state.user}/>
                    <div className="view-container page-centered">
                        <Switch>
                            <Route exact path='/home' component={ViewHome}></Route>
                            <Route exact path='/play' render={() => (<ViewPlay api={this.state.api}
                                                                               user={this.state.user}
                                                                               token={this.state.token}
                                                                               onUpdateUser={this.handleUpdateUser.bind(this)}
                                                                     />
                                                              )}></Route>
                            <Route exact path='/decks' render={() => (<ViewDecks  api={this.state.api}
                                                                                  user={this.state.user}
                                                                            />
                                                                    )}></Route>
                            <Route exact path='/shop' component={ViewShop}></Route>
                            <Route exact path='/collection' render={() => (<ViewCollection api={this.state.api}
                                                                                           user={this.state.user}
                                                                            />
                                                                    )}></Route>
                            <Route exact path='/leaderboard' render={() => (<ViewLeaderboard api={this.state.api}
                                                                                             user={this.state.user}
                                                                            />
                                                                    )}></Route>
                            <Route exact path="/profile" render={(props) => (<ViewProfile api={this.state.api}
                                                                                          search={props.location.search}
                                                                            />
                                                                 )}></Route>
                            <Route render={() => <Redirect to="/home" />} />
                        </Switch>
                    </div>
                </div>
            );
        }
        return (
            <Router>
                {this.state.redirect_to_login}
                <div className="App">
                    {app}
                </div>
            </Router>
        );
    }
}

export default App;
