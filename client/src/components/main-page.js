import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './card';
import { TabMenu, TabMenuItem, Tab } from './tabs';
import GamePage from './game-page';
import ScoresPage from './scores-page';
import ProfilePage from './profile-page';

const constants = require('../constants.js');

const {
    GAME,
    SCORES,
    PROFILE
} = constants.MAIN_VIEWS

export default function MainPage({globalState}) {
    const [tabSelection, setTabSelection] = useState(GAME)

    return (
        <div style={{width: "1000px", height: "730px"}}>
            <Card>
                <CardHeader>
                    Retro Snake
                </CardHeader>
                <CardBody>
                    <TabMenu>
                        <TabMenuItem onClick={() => setTabSelection(GAME)} active={tabSelection === GAME}>
                            Game
                        </TabMenuItem>
                        <TabMenuItem onClick={() => setTabSelection(SCORES)} active={tabSelection === SCORES}>
                            Scores
                        </TabMenuItem>
                        <TabMenuItem onClick={() => setTabSelection(PROFILE)} active={tabSelection === PROFILE}>
                            Profile
                        </TabMenuItem>
                    </TabMenu>
                    {tabSelection === GAME && (
                        <Tab>
                            <GamePage globalState={globalState}/>
                        </Tab>
                    )}
                    {tabSelection === SCORES && (
                        <Tab>
                            <ScoresPage setTabSelection={setTabSelection}/>
                        </Tab>
                    )}
                    {tabSelection === PROFILE && (
                        <Tab>
                            <ProfilePage globalState={globalState}/>
                        </Tab>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}