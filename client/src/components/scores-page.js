import React from 'react';
import { UserTopScores, UserRecentScores, GameScores } from './scores';
import { Card, CardHeader, CardBody } from './card';


export default function ScoresPage() {
    return (
        <div style={{display: "flex", justifyContent: "space-evenly"}}>
            <div style={{width: "300px"}}>
                <Card cardTheme="card-tertiary">
                    <CardHeader>
                        Top 10 Players
                    </CardHeader>
                    <CardBody>
                        <GameScores/>
                    </CardBody>
                </Card>
            </div>
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
            </div>
        </div>
    );
}