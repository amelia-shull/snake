import React, { useState, useEffect } from 'react';
import { Button } from './form';
import { Gameplay } from '../gameplay/gameplay';
import { WebSocketClient } from '../web-socket';
import axios from 'axios';
import { UserScores } from './scores';

const constants = require('../constants.js');

const {
    BASE_URL
} = constants.URL

export default function GamePage({globalState}) {
    const {
        setWS,
        ws,
    } = globalState;

    const [playing, setPlaying] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(undefined);

    if (!gameOver) {
        return (
            <div>
                {!playing && <WaitingRoom setWS={setWS} startNewGame={startNewGame}/>}
                {playing && (
                    <Gameplay 
                        setGameOver={setGameOver}
                        setPlaying={setPlaying}
                        setScore= {setScore}
                        score={score} 
                        opponentScore={opponentScore}
                        setOpponentScore={setOpponentScore}
                        ws={ws}
                    />
                )}
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
                BASE_URL + 'scores',
                requestBody,
                { headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth') } }
            ).then(response => {
                console.log(response)
            })
            .catch(err =>{
                console.log(err)
            })
        }
        return <GameOver startNewGame={startNewGame} score={score} opponentScore={opponentScore}/>
    }

    function startNewGame(gameType){
        ws.startGame(gameType)
        setGameOver(false)
        setPlaying(true) 
    }
}

function WaitingRoom({setWS, startNewGame}) {
    let auth = localStorage.getItem('auth') 
    useEffect(() => {
        setWS(new WebSocketClient(auth))
    },[])

    return (
        <div>
            <h6>{`Welcome ${localStorage.getItem("name")}!`}</h6>

            {
                localStorage.getItem('auth') != null && <UserScores></UserScores>
            }
            <p>Click button when you are ready to play!</p>
            <Button onClick={() => startNewGame("single")}>Single-player</Button>
            {
                localStorage.getItem('auth') != null && <Button onClick={() => startNewGame("multi")}>Multi-player</Button>
            }
        </div>
    )
}

function GameOver({startNewGame, score, opponentScore}) {
    return (
        <div>
            <h3>GAME OVER</h3>
            <h5>This is where it would say who won</h5>
            <br/>
            <h7>{`Your score: ${score}`}</h7>
            <br/>
            { opponentScore != undefined && <h7>{`Opponent's score: ${opponentScore}`}</h7>}
            <Button onClick={() => startNewGame("single")}>Single-player</Button>
            {
                localStorage.getItem('auth') != null && <Button onClick={() => startNewGame("multi")}>Multi-player</Button>
            }
        </div>
    )
}