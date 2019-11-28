import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './card';
import { Button } from './form';
import { Gameplay } from '../gameplay/gameplay';

export default function GamePage({globalState}) {
    const {
        username,
        nickName,
        ws,
    } = globalState;



    const [playing, setPlaying] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    
    if (!gameOver) {
        return (
            <div>
                <Card>
                    <CardHeader>
                        Welcome {nickName ? nickName + "!": (username ? username + "!" : "")}
                    </CardHeader>
                    <CardBody>
                        {!playing && <WaitingRoom setPlaying={setPlaying} username={username} ws={ws}/>}
                        {playing && <Gameplay setGameOver={setGameOver} setPlaying={setPlaying} ws={ws}/>}
                    </CardBody>
                </Card>
            </div>
        )
    } else {
        return <GameOver ws={ws} setGameOver={setGameOver} setPlaying={setPlaying}/>
    }
}

function WaitingRoom({setPlaying, ws, username}) {
    return (
        <div>
            {
                username != undefined && <p>Successfully logged in</p>
            }
            <p>Click button when you are ready to play!</p>
            <Button onClick={() => startGame("single")}>Single-player</Button>
            {
                username != undefined && <Button onClick={() => startGame("multi")}>Multi-player</Button>
            }
        </div>
    )

    function startGame(gameType) {
        ws.startGame(gameType)
        setPlaying(true)
    }
}

function GameOver({ws, setGameOver, setPlaying}) {
    return (
        <Card>
            <CardHeader>
                Game Over!
            </CardHeader>
            <CardBody>
                Play again!
                <Button onClick={() => playAgain("single")}>Single-player</Button>
                <Button onClick={() => playAgain("multi")}>Multi-player</Button>
            </CardBody>
        </Card>
    )

    function playAgain(gameType) {
        ws.startGame(gameType)
        setGameOver(false)
        setPlaying(true)
    }
}