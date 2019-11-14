import React from 'react';
import { Card, CardHeader, CardBody } from './card';
import { Gameplay } from '../gameplay/gameplay';


export default function GamePage({globalState}) {
    const {
        username,
        nickName,
        ws
    } = globalState;

    ws.startGame()

    return (
        <div>
            <Card>
                <CardHeader>
                    Welcome {nickName ? nickName + "!": (username ? username + "!" : "")}
                </CardHeader>
                <CardBody>
                    <Gameplay ws={ws}/>
                </CardBody>
            </Card>
        </div>
    )
}