package main

import (
	"encoding/json"
	"math/rand"
)

// GameData holds all the data of a game
type GameData struct {
	Status string `json:"status"`
	Player Player `json:"player"`
	Food   Point  `json:"food"`
	Size   int    `json:"size"`
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
const size = 40

// NewGame sets up a new game
func NewGame() []byte {
	player := Player{Body: []Point{Point{0, 0}, Point{1, 0}, Point{2, 0}, Point{3, 0}, Point{4, 0}}, Direction: down}
	game = GameData{"active", player, generateFood(), size}

	gameByte, _ := json.Marshal(game)
	return gameByte
}

func generateFood() Point {
	return Point{rand.Intn(39), rand.Intn(39)}
}

// UpdateGame updates the game
func UpdateGame() ([]byte, bool) {
	body := game.Player.Body
	last := body[len(body)-1]
	for i := len(body) - 1; i >= 1; i-- {
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

	// Game over if touch edge
	if body[0].X == -1 && game.Player.Direction == left {
		game.Status = "over"
	}
	if body[0].X == size && game.Player.Direction == right {
		game.Status = "over"
	}
	if body[0].Y == -1 && game.Player.Direction == up {
		game.Status = "over"
	}
	if body[0].Y == size && game.Player.Direction == down {
		game.Status = "over"
	}

	for i := 0; i < len(body); i++ {
		for j := 0; j < len(body); j++ {
			if i != j && body[i].equals(&body[j]) {
				game.Status = "over"
			}
		}
	}

	if body[0].equals(&game.Food) {
		body = append(body, last)
		game.Food = generateFood()
	}

	game.Player.Body = body
	gameByte, _ := json.Marshal(game)
	return gameByte, game.Status == "active"
}

func (p1 *Point) equals(p2 *Point) bool {
	return p1.X == p2.X && p1.Y == p2.Y
}

// UpdateDirection updates the direction
func UpdateDirection(direction string) {
	game.Player.Direction = direction
}
