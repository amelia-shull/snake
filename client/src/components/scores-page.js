import React from 'react';
import { UserScores, GameScores } from './scores';
import { Card, CardHeader, CardBody } from './card';


export default function ScoresPage() {
    return (
        <div style={{display: "flex", justifyContent: "space-evenly"}}>
            <div style={{width: "300px"}}>
                <Card cardTheme="card-tertiary">
                    <CardHeader>
                        Top Scores
                    </CardHeader>
                    <CardBody>
                        <GameScores/>
                    </CardBody>
                </Card>
            </div>
            <div style={{display: "flex", flexDirection: "column", width: "300px"}}>
                <Card cardTheme="card-tertiary">
                    <CardHeader>
                        Your Top Scores
                    </CardHeader>
                    <CardBody>
                        <UserScores/>
                    </CardBody>
                </Card>
                <br/>
                <Card cardTheme="card-tertiary">
                    <CardHeader>
                        Your Recent Scores
                    </CardHeader>
                    <CardBody>
                        <UserScores/>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}