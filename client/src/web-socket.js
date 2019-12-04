const constants = require('./constants.js');

const {
    BASE_URL_WS
} = constants.URL

export class WebSocketClient {
    constructor(auth) {
        let url = auth !== undefined ? BASE_URL_WS + `?auth=${auth}` : BASE_URL_WS
        this.ws = new WebSocket(url)
        this.updateGameState = () => {}
        this.ws.onmessage = event => {
            let data = event.data;
            this.updateGameState(data)
        }
    }

    setUpdateGameStateFunc(updateGameState) {
        this.updateGameState = updateGameState
    }

    startGame(gameType) {
        let userID = localStorage.getItem("auth") != null ? String(localStorage.getItem("userID")) : "guest"
        this.ws.send(JSON.stringify({
            action: "startGame",
            data: gameType,
            userID: userID
        }))
    }

    sendMove(move) {
        this.ws.send(JSON.stringify({
            action: "sendMove",
            data: move
        }))
    }
}

