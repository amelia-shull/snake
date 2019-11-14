import { GamePlay } from './gameplay/gameplay';

export class WebSocketClient {
    constructor() {
        this.ws = new WebSocket("ws://localhost:8844/")
        this.updateGameState = undefined
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
            this.updateGameState(data)
        }
    }

    setUpdateGameStateFunc(updateGameState) {
        this.updateGameState = updateGameState
    }

    startGame() {
        this.ws.send(JSON.stringify({
            action: "startGame"
        }))
    }

    sendMove(move) {
        this.ws.send(JSON.stringify({
            action: "sendMove",
            data: move
        }))
    }
}

