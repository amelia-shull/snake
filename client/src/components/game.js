import React from 'react';
import '../pixel.css';
export default function Game({globalState}) {
    const {
        username,
        nickName
    } = globalState;

    return (
        <div>
            Welcome {nickName ? nickName : username}!
        </div>
    )
}