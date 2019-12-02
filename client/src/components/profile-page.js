import React, { useState, useEffect } from 'react';
import { Button } from './form';
import { Login, Signup } from './login-signup';
import axios from 'axios';
const constants = require('../constants');

const {
  WELCOME
} = constants.MAIN_VIEWS

export default function ProfilePage({globalState}) {
    const {
        setView
    } = globalState;

    var loggedIn = localStorage.getItem('auth') != null

    if (loggedIn) {
        return (
            <div>
                <h6>{`${localStorage.getItem("name")}'s profile`}</h6>
                <Button onClick={() => {
                    axios.delete("http://localhost:8844/sessions/", { 
                        headers: { 
                            'Authorization': localStorage.getItem('auth') 
                        }
                    })
                    localStorage.removeItem("userID")
                    localStorage.removeItem("auth")
                    localStorage.removeItem("name")
                    setView(WELCOME)
                }}>Log out</Button>
            </div>
        );
    } else {
        return (
            <NotAuthorized globalState={globalState}/>
        );
    }
}

function NotAuthorized({globalState}) {
    const [register, setRegister] = useState(false);
    return (
        <div>
            <h6>Log in or sign up to access your scores</h6>
            {
                register && (
                    <div>
                        <div style={{display: "flex", justifyContent: "left"}}>
                            <Button onClick={() => setRegister(!register)}>I already have an account</Button>
                        </div>
                        <Signup globalState={globalState}/>
                    </div>
                )
            }
            {
                !register && (
                    <div>
                        <div style={{display: "flex", justifyContent: "left"}}>
                            <Button onClick={() => setRegister(!register)}>I don't have an account</Button>
                        </div>
                        <Login globalState={globalState}/>
                    </div>
                )
            }
        </div>
    );
}