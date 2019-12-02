import React,  { useState } from 'react';
import { Form, Input, Button, SecureInput } from './form';
import { WebSocketClient } from '../web-socket';
import axios from 'axios';
const constants = require('../constants.js');

const {
    MAIN
} = constants.MAIN_VIEWS

function connectWebSocket(auth, setWS) {
    let ws = new WebSocketClient(auth)
    setWS(ws)
}

export function Login({globalState}) {
    const {
        setView,
        setWS
    } = globalState

    const [err, setErr] = useState(undefined)
    const [inputText, setInputText] = useState("")
    const [inputPassword, setTnputPassword] = useState("")

    return (
        <Form>
            <p>{err != undefined ? err : ""}</p>
            <Input setInputText={setInputText} label="Username"/>
            <SecureInput setInputText={setTnputPassword} label="Password"/>
            <Button onClick={playAsUser}>Login</Button>
        </Form>
    )

    function playAsUser() {
        const creds = {
            password: inputPassword,
            userName: inputText   
        }
        setErr(undefined)
        axios.post(
            'http://localhost:8844/sessions',
            creds,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            let auth = response.headers.authorization
            localStorage.setItem('userID', response.data.id)
            localStorage.setItem('auth', auth);
            localStorage.setItem('name', inputText);
            connectWebSocket(auth, setWS)
            setView(MAIN)
        })
        .catch(err =>{
            if (err.response.status === 401) {
                setErr("Invalid login credentials, please try again.")
            } else {
                setErr("Something went wrong, please try again later.")
            }
        })
    }
}

export function Signup({globalState}) {
    const {
        setView,
        setWS
    } = globalState

    const [err, setErr] = useState(undefined)
    const [inputText, setInputText] = useState("")
    const [inputPassword, setTnputPassword] = useState("")
    const [confPassword, setConfPassword] = useState("")

    return (
        <Form>
            <p>{err != undefined ? err : ""}</p>
            <Input setInputText={setInputText} label="Username"/>
            <SecureInput setInputText={setTnputPassword} label="Password"/>
            <SecureInput setInputText={setConfPassword} label="Type password again"/>
            <Button onClick={createAccount}>Create Account</Button>
        </Form>
    )

    function createAccount() {
        const newUser = {
            password: inputPassword,
            passwordConf: confPassword,
            userName: inputText   
        }
        setErr(undefined)
        axios.post(
            'http://localhost:8844/users',
             newUser,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            let auth = response.headers.authorization
            connectWebSocket(auth, setWS)
            localStorage.setItem('userID', response.data.id)
            localStorage.setItem('auth', auth);
            localStorage.setItem('name', inputText);
            setView(MAIN)
        })
        .catch(err =>{
            console.log(err.response.data)
            if (err.response.status == 400) {
                setErr("Username can't have spaces and password must be >= 6 characters long.")
            } else if (err.response.status == 409) { 
                setErr("Username is already taken, please try again.")
            } else {
                setErr("Something went wrong, please try again later.")
            }
        })
    }
}