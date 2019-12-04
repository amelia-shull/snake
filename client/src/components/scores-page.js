import React from 'react';
import { UserTopScores, UserRecentScores, GameScores } from './scores';
import { Card, CardHeader, CardBody } from './card';
import { Button } from './form';
const constants = require('../constants.js');

const {
    PROFILE
} = constants.MAIN_VIEWS

export default function ScoresPage({setTabSelection}) {
    return (
        <div style={{display: "flex", justifyContent: "space-evenly"}}>
            <div style={{width: "400px"}}>
                <Card cardTheme="card-tertiary">
                    <CardHeader>
                        Leaderboard
                    </CardHeader>
                    <CardBody>
                        <GameScores/>
                    </CardBody>
                </Card>
            </div>
            { localStorage.getItem("auth") != null && (
                <div style={{display: "flex", flexDirection: "column", width: "300px"}}>
                    <Card cardTheme="card-tertiary">
                        <CardHeader>
                            Your 5 Top Scores
                        </CardHeader>
                        <CardBody>
                            <UserTopScores/>
                        </CardBody>
                    </Card>
                    <br/>
                    <Card cardTheme="card-tertiary">
                        <CardHeader>
                            Your 5 Recent Scores
                        </CardHeader>
                        <CardBody>
                            <UserRecentScores/>
                        </CardBody>
                    </Card>
                </div>)
            }
            {
                localStorage.getItem("auth") == null && (
                    <div>
                        <p>Log in to track your own scores</p>
                        <Button buttonLocation="justify-content-center" onClick={() => setTabSelection(PROFILE)}>Okay!</Button>
                    </div>
                )
            }
        </div>
    );
}