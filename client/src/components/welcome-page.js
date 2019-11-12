import React,  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../pixel.css';
import { TabMenu, TabMenuItem, Tab } from './tabs';
import { Form, Input, Button } from './form';

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
        <div>
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
        </div>
    )
}

function Guest({globalState}) {
    const {
        setView,
        setNickName
    } = globalState

    const [inputText, setInputText] = useState("")

    return (
        <Form>
            <Input setInputText={setInputText} label="Nickname"/>
            <Button onClick={playAsGuest}>Play</Button>
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
        setUsername
    } = globalState

    const [inputText, setInputText] = useState("")

    return (
        <Form>
            <Input setInputText={setInputText} label="Username"/>
            <Input label="Password"/>
            <Button onClick={playAsUser}>Login</Button>
        </Form>
    )

    function playAsUser() {
        setView(GAME)
        setUsername(inputText)
    }
}

function Signup({globalState}) {
    const {
        setView,
        setUsername
    } = globalState

    const [inputText, setInputText] = useState("")

    return (
        <Form>
            <Input setInputText={setInputText} label="Username"/>
            <Input label="Password"/>
            <Button onClick={createAccount}>Create Account</Button>
        </Form>
    )

    function createAccount() {
        setView(GAME)
        setUsername(inputText)
    }
}