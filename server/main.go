package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"snake/server/gateway/handlers"
	"snake/server/gateway/sessions"
	"snake/server/gateway/users"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// webSocketData is the form the data
type webSocketData struct {
	Action string `json:"action"`
	Data   string `json:"data"`
}

// Game stores game data and ws info of players
type Game struct {
	Players  []*websocket.Conn
	GameData *GameData
}

var waitingRoom []*websocket.Conn
var players = make(map[*websocket.Conn]*Game)

// ws -> game
// game : players [ws, ws]

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// session signing key
	signingKey := os.Getenv("SESSIONKEY")
	if len(signingKey) == 0 {
		signingKey = "signing key"
	}

	// set up the sql store
	dsn := os.Getenv("DSN")
	if len(dsn) == 0 {
		dsn = "root:sqlpassword@tcp(localhost:3306)/users"
	}
	userStore, err := users.NewMySQLStore(dsn)
	time.Sleep(1)
	err = userStore.Db.Ping()
	if err != nil {
		log.Fatalf("userstore db ping: %s", err)
	}

	// set up redis store
	redisaddr := os.Getenv("REDISADDR")
	if len(redisaddr) == 0 {
		redisaddr = "localhost:6379"
	}
	client := redis.NewClient(&redis.Options{
		Addr: redisaddr,
	})
	sessionStore := sessions.NewRedisStore(client, time.Hour)

	ctx := handlers.NewHandlerContext(signingKey, sessionStore, userStore)

	router := mux.NewRouter()
	router.HandleFunc("/users", ctx.UsersHandler)
	router.HandleFunc("/signin", ctx.SignInHandler)
	router.HandleFunc("/", wsHandler)
	log.Fatal(http.ListenAndServe(":8844", router))
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println(err.Error())
			if err.Error() == "websocket: close 1001 (going away)" {

			}
			return
		}

		var res webSocketData
		err = json.Unmarshal(message, &res)
		if err != nil {
			log.Println(err)
		}

		if res.Action == "startGame" {
			if res.Data == "single" {
				players[ws] = &Game{[]*websocket.Conn{ws}, NewGame(1)}
				startGame(players[ws])
			} else { // multi
				updateWaitingRoom(ws)
			}
		} else if res.Action == "sendMove" {
			updateDirection(players[ws], ws, res.Data)
		}
	}
}

func updateDirection(game *Game, ws *websocket.Conn, direction string) {
	for i, playerWS := range game.Players {
		if playerWS == ws {
			game.GameData.UpdateDirection(i, direction)
		}
	}
}

func updateWaitingRoom(ws *websocket.Conn) {
	if len(waitingRoom) >= 1 {
		// Need to remove player from waiting room
		waitingRoom = append(waitingRoom[:0], waitingRoom[1:]...)
		player1 := waitingRoom[0]
		playerList := []*websocket.Conn{player1, ws}
		newGame := &Game{playerList, NewGame(2)}
		players[player1] = newGame
		players[ws] = newGame
		startGame(newGame)
	} else {
		log.Println("Add player to waiting room")
		waitingRoom = append(waitingRoom, ws)
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
				broadcast(game.Players, jsonData)
				if !active {
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
