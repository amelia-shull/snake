import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';

export function Gameplay({ws, setGameOver, setPlaying}) {
    const [gameState, setGameState] = useState(undefined);
    var parsedState;
    ws.setUpdateGameStateFunc(setGameState)

    var w;
    var h;
    var size = 15;

    
    if (gameState != undefined) {
        parsedState = JSON.parse(gameState)
        console.log(parsedState)
        if (parsedState.status === "active") {
            return (
                <Sketch setup={setup} draw={draw} keyPressed={keyPressed}></Sketch>
            );
        } else {
            setGameOver(true)
            setPlaying(false)
        }
    }
    
    return (
        <div style={{width: "600px", height:"600px", backgroundColor: "220"}}>
            Waiting for other player...
        </div>
    );
    
    
    function setup(p5, canvasParentRef) {
        p5.createCanvas(600, 600).parent(canvasParentRef);
        w = p5.floor(p5.width / size);
        h = p5.floor(p5.width / size);
    }
    
    function draw(p5) {
        p5.scale(size)
        p5.background(220);

        p5.fill("#324cdd");
        p5.noStroke();
        p5.rect(parsedState.food.x, parsedState.food.y, 1, 1);

        parsedState.players.forEach((player, i) => {
            player.body.forEach((point) => {
                p5.fill(0);
                p5.noStroke();
                p5.rect(point.x, point.y, 1, 1);
            })
        })
    }

    
    function keyPressed(p5) {
        if (p5.keyCode === p5.LEFT_ARROW) {
            ws.sendMove("left")
        } else if (p5.keyCode === p5.RIGHT_ARROW) {
            ws.sendMove("right")
        } else if (p5.keyCode === p5.UP_ARROW) {
            ws.sendMove("up")
        } else if (p5.keyCode === p5.DOWN_ARROW) {
            ws.sendMove("down")
        }
    }

}