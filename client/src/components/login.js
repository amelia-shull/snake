import React,  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../pixel.css';
import { TabMenu, TabMenuItem, Tab } from './tabs';

const GUEST = "guest";
const LOGIN = "login";
const SIGNUP = "signup";

export default function LogIn({setView}) {
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
            {tabSelection === GUEST && <Tab>Hello</Tab>}
            {tabSelection === LOGIN && <Tab>Hi</Tab>}
            { tabSelection === SIGNUP && <Tab>HOwdy</Tab>}
        </div>
    )
}

/*
            <div className="card center-vertical-absolute center-horizontal-absolute">
                <div className="card-header">
                    Welcome to Snake!
                </div>
                <div className="card-body">
                    <div className="form-group d-flex align-items-center justify-content-between">
                        <label htmlFor="default" className="mr-3">Enter a username: </label>
                        <input id="default" type="text" className="form-control w-75" />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-sm mr-2 btn-primary border-dark"type="button" onClick={() => setView("game")}>
                            <span className="btn-text">OK</span>
                        </button>
                    </div>
                </div>
            </div>
*/