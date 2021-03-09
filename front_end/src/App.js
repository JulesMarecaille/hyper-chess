import './App.css';
import Game from './chess/ui/Game.js'
import { WHITE, BLACK } from './chess/model/constants.js'
import { createPlayer } from './chess/model/utils.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game side={WHITE}
              whitePlayer={createPlayer("Jules")}
              blackPlayer={createPlayer("Octave")}/>
      </header>
    </div>
  );
}

export default App;
