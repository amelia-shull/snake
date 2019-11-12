import React,  { useState } from 'react';
import WelcomePage from './components/welcome-page';
import Game from './components/game';

const constants = require('./constants');

const {
  GAME,
  WELCOME
} = constants.MAIN_VIEWS



function App() {
  const [view, setView] = useState(WELCOME);
  const [username, setUsername] = useState(undefined);
  const [nickName, setNickName] = useState(undefined);

  const globalState = {
    view,
    setView,
    username,
    setUsername,
    nickName,
    setNickName
  }

  return (
    <div className="bg-secondary">
      {view === WELCOME && (<WelcomePage globalState={globalState}/>)}
      {view === GAME && (<Game globalState={globalState}/>)}
    </div>
  );
}

export default App;
