package main

import "encoding/json"

// GameData holds all the data of a game
type GameData struct {
	Player Player `json:"player"`
	Food   Point  `json:"food"`
}

// Player represents the location of a player
type Player struct {
	Body      []Point `json:"body"`
	Direction string  `json:"direction"`
}

// Point is a single point in the game
type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

var game GameData

const up = "up"
const down = "down"
const left = "left"
const right = "right"

// NewGame sets up a new game
func NewGame() []byte {
	player := Player{Body: []Point{Point{0, 0}}, Direction: down}
	game = GameData{player, Point{50, 50}}

	gameByte, _ := json.Marshal(game)
	return gameByte
}

// UpdateGame updates the game
func UpdateGame() []byte {
	body := game.Player.Body
	for i := 1; i <= len(body); i++ {
		body[i] = body[i-1]
	}
	if game.Player.Direction == down {
		body[0].Y = body[0].Y + 1
	} else if game.Player.Direction == up {
		body[0].Y = body[0].Y - 1
	} else if game.Player.Direction == left {
		body[0].X = body[0].X - 1
	} else { // right
		body[0].X = body[0].X + 1
	}
	game.Player.Body = body

	gameByte, _ := json.Marshal(game)
	return gameByte
}
