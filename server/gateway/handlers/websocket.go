package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"snake/server/gateway/sessions"
	"time"

	"github.com/gorilla/websocket"
)

// webSocketData is the form the data
type webSocketData struct {
	Action string `json:"action"`
	Data   string `json:"data"`
	UserID string `json:"userID"`
}

// PlayerConnection holds a player connection and userID as identification
type PlayerConnection struct {
	Ws     *websocket.Conn
	UserID string
}

// Game stores game data and ws info of players
type Game struct {
	Players     []*PlayerConnection
	Connections []*websocket.Conn
	GameData    *GameData
}

var waitingRoom WaitingRoom
var players = make(map[*websocket.Conn]*Game)

// ws -> game
// game : players [ws, ws]

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// WsHandler handles the websocket connection to play a game of snake.
func (ctx *HandlerContext) WsHandler(w http.ResponseWriter, r *http.Request) {
	// check if current user is authenticated; if err is not nil user is a guest
	sessionState := &SessionState{}
	_, authError := sessions.GetState(r, ctx.SigningKey, ctx.SessionStore, sessionState)

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			// Removes players from game if one leaves
			if players[ws] != nil {
				players[ws].GameData.Status = "over"
				for _, conn := range players[ws].Players {
					if conn.Ws == ws {
						players[ws].GameData.FinalStatus = conn.UserID
					}
				}
				delete(players, ws)
				log.Println("removing player, ws close")
			}
			// Removes player from waitingRoom if they leave
			if index := waitingRoom.IndexOf(ws); index > -1 {
				waitingRoom.RemoveAt(index)
			}
			return
		}

		var res webSocketData
		err = json.Unmarshal(message, &res)
		if err != nil {
			log.Println(err)
		}

		if res.Action == "startGame" {
			if res.Data == "single" || authError != nil { // Force guest to play singe-player
				players[ws] = &Game{[]*PlayerConnection{&PlayerConnection{ws, res.UserID}}, []*websocket.Conn{ws}, NewGame(1, []string{res.UserID})}
				startGame(players[ws])
			} else { // multi
				updateWaitingRoom(ws, res.UserID)
			}
		} else if res.Action == "sendMove" {
			updateDirection(players[ws], ws, res.Data)
		}
	}
}

func updateDirection(game *Game, ws *websocket.Conn, direction string) {
	for i, playerWS := range game.Players {
		if playerWS.Ws == ws {
			game.GameData.UpdateDirection(i, direction)
		}
	}
}

func updateWaitingRoom(ws *websocket.Conn, userID string) {
	if waitingRoom.Size() >= 1 {
		player1 := waitingRoom.Remove()
		playerList := []*PlayerConnection{player1, &PlayerConnection{ws, userID}}
		newGame := &Game{playerList, []*websocket.Conn{player1.Ws, ws}, NewGame(2, []string{player1.UserID, userID})}
		players[player1.Ws] = newGame
		players[ws] = newGame
		startGame(newGame)
	} else {
		log.Println("Add player to waiting room")
		waitingRoom.Add(ws, userID)
	}
}

func startGame(game *Game) {
	log.Println("start game")
	ticker := time.NewTicker(150 * time.Millisecond)
	quit := make(chan bool)

	go func(game *Game) {
		for {
			select {
			case <-ticker.C:
				gameData, active := game.GameData.UpdateGame()
				game.GameData = gameData
				jsonData, _ := json.Marshal(game.GameData)
				broadcast(game.Connections, jsonData)
				if !active {
					for _, ws := range game.Connections {
						delete(players, ws)
					}
					quit <- true
				}
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}(game)
}

func broadcast(players []*websocket.Conn, message []byte) {
	for _, ws := range players {
		ws.WriteMessage(websocket.TextMessage, message)
	}
}
