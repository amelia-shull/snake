import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from './card';
import { TabMenu, TabMenuItem, Tab } from './tabs';
import GamePage from './game-page';
import ProfilePage from './profile-page';

export default function MainPage({globalState}) {

    const GAME = "game";
    const SCORES = "scores";
    const PROFILE = "profile";
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