package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// WebSocketData is the form the data
type WebSocketData struct {
	Action string `json:"action"`
	Data   string `json:"data"`
}

var clients = make(map[*websocket.Conn]bool)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", wsHandler)

	log.Fatal(http.ListenAndServe(":8844", router))
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	clients[ws] = true
	for {
		messageType, message, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var res WebSocketData
		err = json.Unmarshal(message, &res)
		if err != nil {
			log.Println(err)
		}
		if res.Action == "sendUser" {
			if res.Data == "guest" {
				game := NewGame()
				ws.WriteMessage(websocket.TextMessage, game)
				// every .5 second call update and write message
			}
		}
		log.Printf("Message recieved: Type: %d, Messge: %s", messageType, message)
	}
}
