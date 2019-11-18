import { GamePlay } from './gameplay/gameplay';

export class WebSocketClient {
    constructor() {
        this.ws = new WebSocket("ws://localhost:8844/")
        this.updateGameState = () => {}
    }

    connect() {
        this.ws.onopen = event => {
            this.ws.send(JSON.stringify({
                action: "sendId",
                data: "123"
            }))
        }
        this.ws.onmessage = event => {
            let data = event.data;
            if (data.startsWith("Update:")) {
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

