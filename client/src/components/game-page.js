import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './card';
import { Button } from './form';
import { Gameplay } from '../gameplay/gameplay';
import { WebSocketClient } from '../web-socket';
import axios from 'axios';

export default function GamePage({globalState}) {
    const {
        username,
        nickName,
        setWS,
        ws,
    } = globalState;

    const [playing, setPlaying] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0);

    function connectWebSocket(auth) {
        let wsClient = new WebSocketClient(auth)
        setWS(wsClient)
        return wsClient
    }

    if (!gameOver) {
        return (
            <div>
                <Card>
                    <CardHeader>
                        Welcome {nickName ? nickName + "!": (username ? username + "!" : "")}
                    </CardHeader>
                    <CardBody>
                        {!playing && <WaitingRoom ws={ws} setPlaying={setPlaying} connectWebSocket={connectWebSocket}/>}
                        {playing && <Gameplay setGameOver={setGameOver} setPlaying={setPlaying} setScore= {setScore} ws={ws}/>}
                    </CardBody>
                </Card>
            </div>
        )
    } else {
        if (localStorage.getItem('auth') != null) {
            let userID = localStorage.getItem('userID')
            let requestBody = {
                score: score,
                userID: parseInt(userID)
            }
            axios.post(
                'http://localhost:8844/scores',
                requestBody,
                { headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth') } }
            ).then(response => {
                console.log(response)
            })
            .catch(err =>{
                console.log(err)
            })
        }
        return <GameOver ws={ws} setGameOver={setGameOver} setPlaying={setPlaying}/>
    }
}

function WaitingRoom({ws, setPlaying, connectWebSocket}) {
    return (
        <div>
            {
                localStorage.getItem('auth') != null && <p>Successfully logged in.</p>
            }
            <p>Click button when you are ready to play!</p>
            <Button onClick={() => startGame("single")}>Single-player</Button>
            {
                localStorage.getItem('auth') != null && <Button onClick={() => startGame("multi")}>Multi-player</Button>
            }
        </div>
    )

    function startGame(gameType) {
        let auth = localStorage.getItem('auth')
        if (ws == undefined) {
            let wsClient = connectWebSocket(auth)
            setTimeout(() => {
                wsClient.startGame(gameType)
            }, 50)
        } else {
            ws.startGame(gameType)
        }
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