import './App.css';
import LeftMenu from './components/navigation/LeftMenu';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import views from './components/views';
import HyperChessAPI from './connection/HyperChessAPI.js'

function App() {
    let api = new HyperChessAPI("url", "token");
    return (
        <Router>
            <div className="App">
                <LeftMenu/>
                <div className="view-container">
                    <Switch>
                        <Route exact path='/' component={views.ViewHome}></Route>
                        <Route exact path='/game' component={views.ViewGame}></Route>
                        <Route exact path='/decks' component={views.ViewDecks}></Route>
                        <Route exact path='/shop' component={views.ViewShop}></Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
