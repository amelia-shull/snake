import React,  { useState } from 'react';
import { Form, Input, Button, SecureInput } from './form';
import { WebSocketClient } from '../web-socket';
import axios from 'axios';
const constants = require('../constants.js');

const {
    MAIN
} = constants.MAIN_VIEWS

const {
    BASE_URL
} = constants.URL

function connectWebSocket(auth, setWS) {
    let ws = new WebSocketClient(auth)
    setWS(ws)
}

export function Login({globalState}) {
    const {
        setView,
        setWS
    } = globalState

    const [inputText, setInputText] = useState("")
    const [inputPassword, setTnputPassword] = useState("")

    return (
        <Form>
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
        axios.post(
            BASE_URL + 'sessions',
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
            console.log(err)
        })
    }
}

export function Signup({globalState}) {
    const {
        setView,
        setWS
    } = globalState

    const [inputText, setInputText] = useState("")
    const [inputPassword, setTnputPassword] = useState("")
    const [confPassword, setConfPassword] = useState("")

    return (
        <Form>
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
        axios.post(
            BASE_URL + 'users',
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
            console.log(err)
        })
    }
}