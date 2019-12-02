import React, { useState, useEffect } from 'react';
import axios from 'axios';

const constants = require('../constants.js');

const {
    BASE_URL
} = constants.URL

export function GameScores() {
    const [top, setTop] = useState(undefined)

    useEffect(() => {
        getTopScore().then(res => { setTop(res) })
    },[])

    return (
        <div>
            <p>High Scores:</p>
            <ul>
                {top}
            </ul>
        </div>
    )

    async function getTopScore() {
        const res = await axios.get(BASE_URL + 'scores/')
        return res.data ? res.data.map((score, index) => <li key={index}>{score.score}</li>) : <></>
    }
}

export function UserScores() {
    const [top, setTop] = useState(undefined)
    const [recent, setRecent] = useState(undefined)

    useEffect(() => {
        getTopScore().then(res => { setTop(res) })
        getRecentScore().then(res => { setRecent(res) })
    },[])

    return (
        <div>
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
        const res = await axios.get(BASE_URL + 'scores/' + localStorage.getItem('userID') + "?top=5")
        return res.data ? res.data.map((score, index) => <li key={index}>{score.score}</li>) : <></>
    }

    async function getRecentScore() {
        const res = await axios.get(BASE_URL + 'scores/' + localStorage.getItem('userID') + "?recent=5")
        return res.data ? res.data.map((score, index) => <li key={index}>{score.score}</li>) : <></>
    }
}