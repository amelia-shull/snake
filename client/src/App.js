import React,  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './pixel.css';
import WelcomePage from './components/welcome-page';
import GamePage from './components/game-page';

const constants = require('./constants');

const {
  GAME,
  WELCOME
} = constants.MAIN_VIEWS

const styleApp = {
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center"
}


function App({ws}) {
  const [view, setView] = useState(WELCOME);
  const [username, setUsername] = useState(undefined);
  const [nickName, setNickName] = useState(undefined);

  const globalState = {
    view,
    setView,
    username,
    setUsername,
    nickName,
    setNickName,
    ws
  }
  
  return (
    <div className="bg-secondary">
      <div style={styleApp}>
        {view === WELCOME && (<WelcomePage globalState={globalState}/>)}
        {view === GAME && (<GamePage globalState={globalState}/>)}
      </div>
    </div>
  );
}

export default App;
