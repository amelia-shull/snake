 


export class WebSocketClient {
    constructor() {
        this.ws = new WebSocket("ws://localhost:8844/")
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
            console.log(data)
        }
    }

    sendUser(user) {
        this.ws.send(JSON.stringify({
            action: "sendUser",
            data: user
        }))
    }
}

