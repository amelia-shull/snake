
export class WebSocketClient {
    constructor(auth) {
        let url = auth !== undefined ? `ws://localhost:8844/?auth=${auth}` : "ws://localhost:8844/"
        this.ws = new WebSocket(url)
        this.updateGameState = () => {}
        this.ws.onmessage = event => {
            let data = event.data;
            if (data.startsWith("Update:")) { // I don't remember why I did this testing something????
                console.log(data)
            } else {
                this.updateGameState(data)
            }
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

