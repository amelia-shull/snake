import React, { useState, useEffect } from 'react';
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

    if (!gameOver) {
        return (
            <div>
                <Card>
                    <CardHeader>
                        Welcome {nickName ? nickName + "!": (username ? username + "!" : "")}
                    </CardHeader>
                    <CardBody>
                        {!playing && <WaitingRoom ws={ws} setPlaying={setPlaying} setWS={setWS}/>}
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

function WaitingRoom({ws, setPlaying, setWS}) {
    let auth = localStorage.getItem('auth') 
    useEffect(() => {
        setWS(new WebSocketClient(auth))
    },[])

    return (
        <div>
            {
                localStorage.getItem('auth') != null && <UserScores></UserScores>
            }
            <p>Click button when you are ready to play!</p>
            <Button onClick={() => startGame("single")}>Single-player</Button>
            {
                localStorage.getItem('auth') != null && <Button onClick={() => startGame("multi")}>Multi-player</Button>
            }
        </div>
    )

    function startGame(gameType) {
        ws.startGame(gameType)
        setPlaying(true)
    }
}

function UserScores() {
    const [top, setTop] = useState(undefined)
    const [recent, setRecent] = useState(undefined)

    useEffect(() => {
        getTopScore().then(res => { setTop(res) })
        getRecentScore().then(res => { setRecent(res) })
    },[])

    return (
        <div>
            <p>Successfully logged in.</p>
            <p>Your top scores:</p>
            <ul>
                {top}
            </ul>
            <p>Your recent scores:</p>
            <ul>
                {recent}
            </ul>
        </div>
    )

    async function getTopScore() {
        const res = await axios.get('http://localhost:8844/scores/' + localStorage.getItem('userID') + "?top=5")
        return res.data ? res.data.map((score, index) => <li key={index}>{score.score}</li>) : <></>
    }

    async function getRecentScore() {
        const res = await axios.get('http://localhost:8844/scores/' + localStorage.getItem('userID') + "?recent=5")
        return res.data ? res.data.map((score, index) => <li key={index}>{score.score}</li>) : <></>
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
                {
                    localStorage.getItem('auth') != null && <Button onClick={() => playAgain("multi")}>Multi-player</Button>
                }
            </CardBody>
        </Card>
    )

    function playAgain(gameType) {
        ws.startGame(gameType)
        setGameOver(false)
        setPlaying(true)
    }
}