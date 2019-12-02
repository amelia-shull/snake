import React,  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './pixel.css';
import WelcomePage from './components/welcome-page';
import MainPage from './components/main-page';

const constants = require('./constants');

const {
  MAIN,
  WELCOME
} = constants.MAIN_VIEWS

const styleApp = {
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center"
}

function App() {
    const [view, setView] = useState(WELCOME);
    const [ws, setWS] = useState(undefined);

    const globalState = {
        view,
        setView,
        ws,
        setWS
    }

    let authLocal = localStorage.getItem('auth')
    if (authLocal !== null && view !== MAIN) {
        setView(MAIN)
    }
    
    return (
        <div className="bg-secondary">
			<div style={styleApp}>
				{view === WELCOME && (<WelcomePage globalState={globalState}/>)}
				{view === MAIN && (<MainPage globalState={globalState}/>)}
			</div>
        </div>
    );
}

export default App;
