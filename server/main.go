package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

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
		ticker := time.NewTicker(1 * time.Second)
		quit := make(chan struct{})

		if res.Action == "startGame" {
			game := NewGame()
			ws.WriteMessage(websocket.TextMessage, game)
			go func(game []byte, ws *websocket.Conn) {
				for {
					select {
					case <-ticker.C:
						game = UpdateGame()
						ws.WriteMessage(websocket.TextMessage, game)
						log.Print("send game status")
					case <-quit:
						// Figure out how and where to quit, when game isn't currently being played
						ticker.Stop()
						return
					}
				}
			}(game, ws)
		} else if res.Action == "sendMove" {
			UpdateDirection(res.Data)
		}
		log.Printf("Message recieved: Type: %d, Messge: %s", messageType, message)
	}
}
