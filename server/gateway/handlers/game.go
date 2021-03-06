package handlers

import (
	"math/rand"
)

// GameData holds all the data of a game
type GameData struct {
	Status      string   `json:"status"`
	Players     []Player `json:"players"`
	Food        Point    `json:"food"`
	Size        int      `json:"size"`
	FinalStatus string   `json:"finalStatus"`
}

// Player represents the location of a player
type Player struct {
	Body      []Point `json:"body"`
	Direction string  `json:"direction"`
	Score     int     `json:"score"`
	UserID    string  `json:"userID"`
}

// Point is a single point in the game
type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

const up = "up"
const down = "down"
const left = "left"
const right = "right"
const size = 40

// NewGame sets up a new game
func NewGame(count int, userID []string) *GameData {
	var gameData *GameData
	player0 := Player{Body: []Point{Point{0, 0}}, Direction: down, Score: 0, UserID: userID[0]}
	players := []Player{player0}
	if count == 2 {
		player1 := Player{Body: []Point{Point{size - 1, size - 1}}, Direction: up, Score: 0, UserID: userID[1]}
		players = []Player{player0, player1}
	}
	gameData = &GameData{"active", players, generateFood(), size, ""}

	return gameData
}

func generateFood() Point {
	return Point{rand.Intn(size - 1), rand.Intn(size - 1)}
}

// UpdateGame updates the game
func (gameData *GameData) UpdateGame() (*GameData, bool) {
	for index, player := range gameData.Players {

		body := player.Body
		last := body[len(body)-1]

		for i := len(body) - 1; i >= 1; i-- {
			body[i] = body[i-1]
		}
		if player.Direction == down {
			body[0].Y = body[0].Y + 1
		} else if player.Direction == up {
			body[0].Y = body[0].Y - 1
		} else if player.Direction == left {
			body[0].X = body[0].X - 1
		} else { // right
			body[0].X = body[0].X + 1
		}

		// Game over if touch edge
		if body[0].X == -1 && player.Direction == left {
			gameData.Status = "over"
			if gameData.FinalStatus != "" {
				gameData.FinalStatus = "tie"
			} else {
				gameData.FinalStatus = player.UserID
			}
		}
		if body[0].X == size && player.Direction == right {
			gameData.Status = "over"
			if gameData.FinalStatus != "" {
				gameData.FinalStatus = "tie"
			} else {
				gameData.FinalStatus = player.UserID
			}
		}
		if body[0].Y == -1 && player.Direction == up {
			gameData.Status = "over"
			if gameData.FinalStatus != "" {
				gameData.FinalStatus = "tie"
			} else {
				gameData.FinalStatus = player.UserID
			}
		}
		if body[0].Y == size && player.Direction == down {
			gameData.Status = "over"
			if gameData.FinalStatus != "" {
				gameData.FinalStatus = "tie"
			} else {
				gameData.FinalStatus = player.UserID
			}
		}

		for i := 0; i < len(body); i++ {
			for j := 0; j < len(body); j++ {
				if i != j && body[i].equals(&body[j]) {
					gameData.Status = "over"
					if gameData.FinalStatus != "" {
						gameData.FinalStatus = "tie"
					} else {
						gameData.FinalStatus = player.UserID
					}
				}
			}
		}

		if body[0].equals(&gameData.Food) {
			body = append(body, last)
			gameData.Food = generateFood()
			gameData.Players[index].Score = player.Score + 100
		}

		gameData.Players[index].Body = body
	}
	if len(gameData.Players) > 1 {
		body1 := gameData.Players[0].Body
		body2 := gameData.Players[1].Body

		// test player 1 hitting player 2
		for i := 0; i < len(body2); i++ {
			if body1[0] == body2[i] {
				gameData.Status = "over"
				if gameData.FinalStatus != "" {
					gameData.FinalStatus = "tie"
				} else {
					gameData.FinalStatus = gameData.Players[0].UserID
				}
			}
		}
		// test player 2 hitting player 1
		for i := 0; i < len(body1); i++ {
			if body2[0] == body1[i] {
				gameData.Status = "over"
				if gameData.FinalStatus != "" {
					gameData.FinalStatus = "tie"
				} else {
					gameData.FinalStatus = gameData.Players[1].UserID
				}
			}
		}
	}
	return gameData, gameData.Status == "active"
}

func (p1 *Point) equals(p2 *Point) bool {
	return p1.X == p2.X && p1.Y == p2.Y
}

// UpdateDirection updates the direction
func (gameData *GameData) UpdateDirection(index int, direction string) {
	cases := [][]string{[]string{left, right}, []string{up, down}}
	for _, c := range cases {
		if direction == c[0] && gameData.Players[index].Direction == c[1] ||
			gameData.Players[index].Direction == c[0] && direction == c[1] {
			return
		}
	}
	gameData.Players[index].Direction = direction
}
