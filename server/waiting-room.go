package main

import "github.com/gorilla/websocket"

// WaitingRoom is a queue
type WaitingRoom struct {
	players []*PlayerConnection
	size    int
}

// IndexOf determines the location of the ws connection in the waitingRoom
func (wr *WaitingRoom) IndexOf(ws *websocket.Conn) int {
	for i := 0; i < wr.size; i++ {
		if wr.players[i].Ws == ws {
			return i
		}
	}
	return -1
}

// Add will add a ws connection to the queue
func (wr *WaitingRoom) Add(ws *websocket.Conn, userID string) {
	connection := &PlayerConnection{ws, userID}
	if wr.size >= len(wr.players) {
		wr.players = append(wr.players, &PlayerConnection{})
	}
	wr.players[wr.size] = connection
	wr.size = wr.size + 1
}

// Remove will return the ws that has been in the
// queue the longest
func (wr *WaitingRoom) Remove() *PlayerConnection {
	if wr.size >= 1 {
		wr.size = wr.size - 1
		first := wr.players[0]
		for i := 0; i < wr.size; i++ {
			wr.players[i] = wr.players[i+1]
		}
		wr.players[wr.size] = &PlayerConnection{}
		return first
	}
	return nil
}

// RemoveAt will remove a player at given index from the waitingRoom
func (wr *WaitingRoom) RemoveAt(index int) {
	if wr.size >= 1 {
		for i := index; i < wr.size-1; i++ {
			wr.players[i] = wr.players[i+1]
		}
	}
	wr.size = wr.size - 1
}

// Size returns the size of queue
func (wr *WaitingRoom) Size() int {
	return wr.size
}
