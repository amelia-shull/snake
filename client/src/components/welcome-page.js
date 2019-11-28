import React,  { useState } from 'react';
import { TabMenu, TabMenuItem, Tab } from './tabs';
import { Form, Input, Button, SecureInput } from './form';
import { Card, CardHeader, CardBody } from './card';
import axios from 'axios';

const constants = require('../constants.js');

const {
    GAME
} = constants.MAIN_VIEWS

const GUEST = "guest";
const LOGIN = "login";
const SIGNUP = "signup";

export default function WelcomePage({globalState}) {
    const [tabSelection, setTabSelection] = useState(GUEST)
   
    return (
        <div style={{width: "40vw"}}>
            <Card>
                <CardHeader>
                    Welcome to Snake!
                </CardHeader>
                <CardBody>
                    <TabMenu>
                        <TabMenuItem onClick={() => setTabSelection(GUEST)} active={tabSelection === GUEST}>
                            Play as Guest
                        </TabMenuItem>
                        <TabMenuItem onClick={() => setTabSelection(LOGIN)} active={tabSelection === LOGIN}>
                            Login
                        </TabMenuItem>
                        <TabMenuItem onClick={() => setTabSelection(SIGNUP)} active={tabSelection === SIGNUP}>
                            Signup
                        </TabMenuItem>
                    </TabMenu>
                    {tabSelection === GUEST && (
                        <Tab>
                            <Guest globalState={globalState}/>
                        </Tab>
                    )}
                    {tabSelection === LOGIN && (
                        <Tab>
                            <Login globalState={globalState}/>
                        </Tab>
                    )}
                    {tabSelection === SIGNUP && (
                        <Tab>
                            <Signup globalState={globalState}/>
                        </Tab>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

function Guest({globalState}) {
    const {
        setView,
        setNickName,
        ws
    } = globalState

    const [inputText, setInputText] = useState("")

    return (
        <Form>
            <Input setInputText={setInputText} label="Nickname"/>
            <Button onClick={playAsGuest}>Go</Button>
        </Form>
    )

    function playAsGuest() {
        setView(GAME)
        setNickName(inputText)
    }
}

function Login({globalState}) {
    const {
        setView,
        setUsername,
        ws,
        setAuthToken
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
            'http://localhost:8844/sessions',
            creds,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            setAuthToken(response.headers.authorization)
        })
        setView(GAME)
        setUsername(inputText)
    }
}

function Signup({globalState}) {
    const {
        setView,
        setUsername,
        ws,
        setAuthToken
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
            'http://localhost:8844/users',
             newUser,
            { headers: { 'Content-Type': 'application/json' } }
        ).then(response => {
            setAuthToken(response.headers.authorization)
        })
        setView(GAME)
        setUsername(inputText)
    }
}