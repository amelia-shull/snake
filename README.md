# Retro Snake Documentation
INFO 441 Final Project

## Endpoints

## WebSocket Messages
Websocket will connect when the client joins the waiting room (game tab). The client sends the `auth` token recieved from the `/session` endpoint. 

The client can then send the following data to the server through the websocket connection:
``` JSON
// Lets the server know to start the game or add the player
// to the waiting room
{
	action: "startGame",
	data: "single" | "multi",
	userID: (userID)
}

// Lets the server know when the player makes a move
{
	action: "sendMove",
	data: "left" | "right" | "up" | "down"
}
```

The server sends the following data to the client:
``` JSON
	status: "active" | "over",
	players: [
		{
			body: [{(xCoord), (yCoord)}],
			direction: "left" | "right" | "up" | "down",
			score: (score)
			userID: (userID)
		}
	],
	food: {(xCoord), (yCoord)},
	size: (size of pixels)
	finalStatus: (userID of loser) | "tie" | ""
```
For a single player game, the `players` array will only contain one element, for multi-player it would contain two. The `body` array contains points representing the location of the player's snake, the 0 element being the head. The `food` field contains a single point representing where the food is located. 

