import React,  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './pixel.css';
import WelcomePage from './components/welcome-page';
import GamePage from './components/game-page';
import { Button } from './components/form';
import axios from 'axios';

const constants = require('./constants');

const {
  GAME,
  WELCOME
} = constants.MAIN_VIEWS

const {
    BASE_URL
} = constants.URL

const styleApp = {
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center"
}

function App() {
    const [view, setView] = useState(WELCOME);
    const [username, setUsername] = useState(undefined);
    const [nickName, setNickName] = useState(undefined);
    const [ws, setWS] = useState(undefined);

    const globalState = {
        view,
        setView,
        username,
        setUsername,
        nickName,
        setNickName,
        ws,
        setWS
    }

    let authLocal = localStorage.getItem('auth')
    if (authLocal !== null && view !== GAME) {
        setView(GAME)
    }
    
    return (
        <div className="bg-secondary">
        <div style={styleApp}>
            {view === WELCOME && (<WelcomePage globalState={globalState}/>)}
            {view === GAME && (<GamePage globalState={globalState}/>)}
        </div>
        {
            localStorage.getItem('auth') != null && (
            <Button onClick={() => {
                axios.delete(BASE_URL + "sessions/", { 
                    headers: { 
                        'Authorization': localStorage.getItem('auth') 
                    }
                })
                localStorage.removeItem("userID")
                localStorage.removeItem("auth")
                setView(WELCOME)
            }}>Log out</Button>)
        }
        </div>
    );
}

export default App;
