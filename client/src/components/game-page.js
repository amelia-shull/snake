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

    function setup(p5, canvasParentRef) {
        p5.createCanvas(600, 600).parent(canvasParentRef)
    }

    function draw(p5) {
        p5.background(255)
        p5.ellipse(50, 50, 70, 70)
    }
}