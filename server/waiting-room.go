package main

import "github.com/gorilla/websocket"

// WaitingRoom is a queue
type WaitingRoom struct {
	players []*websocket.Conn
	size    int
}

// Add will add a ws connection to the queue
func (wr *WaitingRoom) Add(ws *websocket.Conn) {
	if wr.size >= len(wr.players) {
		wr.players = append(wr.players, nil)
	}
	wr.players[wr.size] = ws
	wr.size = wr.size + 1
}

// Remove will return the ws that has been in the
// queue the longest
func (wr *WaitingRoom) Remove() *websocket.Conn {
	if wr.size >= 1 {
		wr.size = wr.size - 1
		first := wr.players[0]
		for i := 0; i < wr.size; i++ {
			wr.players[i] = wr.players[i+1]
		}
		wr.players[wr.size] = nil
		return first
	}
	return nil
}

// Size returns the size of queue
func (wr *WaitingRoom) Size() int {
	return wr.size
}
