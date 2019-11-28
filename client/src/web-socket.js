
export class WebSocketClient {
    constructor(auth) {
        let url = auth != undefined ? `ws://localhost:8844/?auth=${auth}` : "ws://localhost:8844/"
        this.ws = new WebSocket(url)
        this.updateGameState = () => {}
    }

    connect() {
        this.ws.onopen = event => {
            this.ws.send(JSON.stringify({
                action: "sendId",
                data: "123" // TODO: generate userID, so UI knows which player it is
            }))
        }
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
        this.ws.send(JSON.stringify({
            action: "startGame",
            data: gameType
        }))
    }

    sendMove(move) {
        this.ws.send(JSON.stringify({
            action: "sendMove",
            data: move
        }))
    }
}

