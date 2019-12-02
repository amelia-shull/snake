import React,  { useState } from 'react';
import { TabMenu, TabMenuItem, Tab } from './tabs';
import { Form, Input, Button, SecureInput } from './form';
import { Card, CardHeader, CardBody } from './card';
import { WebSocketClient } from '../web-socket';
import { Login, Signup } from './login-signup';

const constants = require('../constants.js');

const {
    MAIN
} = constants.MAIN_VIEWS

const GUEST = "guest";
const LOGIN = "login";
const SIGNUP = "signup";

export default function WelcomePage({globalState}) {
    const [tabSelection, setTabSelection] = useState(GUEST)
    const {
        setWS
    } = globalState;
   
    return (
        <div style={{width: "650px", height: "330px"}}>
            <Card>
                <CardHeader>
                    Welcome to Retro Snake!
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
                            <p>Play as guest for single-player game.</p>
                            <p>Login or sign up to play multi-player and track scores!</p>
                            <Guest globalState={globalState} connectWebSocket={connectWebSocket}/>
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

    function connectWebSocket(auth) {
        let ws = new WebSocketClient(auth)
        setWS(ws)
    }
}

function Guest({globalState, connectWebSocket}) {
    const {
        setView
    } = globalState

    const [inputText, setInputText] = useState("")

    return (
        <Form>
            <Input setInputText={setInputText} label="Nickname"/>
            <Button onClick={playAsGuest}>Go</Button>
        </Form>
    )

    function playAsGuest() {
        connectWebSocket(undefined)
        setView(MAIN)
        localStorage.setItem("name", inputText)
    }
}