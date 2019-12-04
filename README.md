# Retro Snake Documentation

INFO 441 Final Project

Amelia Shull & Kateka Seth

## Our Site

**API:** https://snakeapi.katekaseth.me

**Client:** https://retrosnake.me

## Architecture Diagram
![Architecture Diagram](/diagrams/final_arch_diagram.png)

## Endpoints
- `POST /scores`: adds user's score to database
  - Request body:
	``` Javascript
	{
		score: (score),
		userID: (userID)
	}
	```
	
  - Responses:
    - `200`: score added successfully
    - `400`: Can't insert to store
    - `401`: User not authenticated, User not authorized
    - `405`: Method must be POST
    - `415`: Request body must be in JSON, Request is nil
    - `500`: Error adding score, Decoding failed

- `GET /scores/`: gets top 10 (default) scores of all players
  - Parameters:
    - `?top=n`: encodes the top n scores
  - Responses:
    - `200`: (Successfully returns scores)
    - `400`: Bad url, Bad number
    - `405`: Method must be GET
    - `500`: Error getting scores
  - Request body:
	``` Javascript
	[
		{
			score: (score),
			userID: (userID),
			created: (datetime)
		},
	]
	```

- `GET /scores/{userID}`: gets all scores of specific player
  - Parameters:
    - `?top=n`: encodes the top n scores
    - `?recent=n`: encodes n most recent scores
  - Responses:
    - `200`: (Successfully returns scores)
    - `400`: Bad url, Bad number, Bad user id
    - `405`: Method must be GET
    - `500`: Error getting scores
  - Request body:
	``` Javascript
	[
		{
			score: (score),
			userID: (userID),
			created: (datetime)
		},
	]
	```

- `POST /users`: creates new user accounts and begins a new session
  - Request body:
	``` Javascript
	{
		userName: (userName),
		password: (password),
		passwordConf: (password typed again)
	}
	```
  - Response body:
	``` Javascript
	{
		userID: (userID),
		userName: (userName)
	}
	```
  - Response headers:
    - `Authorization`: bearer token for the session
  - Responses:
    - `201`: (Successfully creates user and begins new session)
    - `400`: Invalid new user
    - `405`: Method must be POST
    - `409`: Can't insert to store, Error beginning a session
    - `415`: Request body must be in JSON, Request is nil
    - `500`: Decoding failed, Internal server error

- `POST /sessions`: begins a new session for user
  - Request body:
	``` Javascript
	{
		password: (password),
		userName: (userName)  
	}
	```
  - Response body:
	``` Javascript
	{
		userID: (userID),
		userName: (userName)
	}
	```
  - Response headers:
    - `Authorization`: bearer token for the session
  - Responses:
    - `201`: (Session successfully started)
    - `401`: Invalid credentials
    - `405`: Method must be POST
    - `409`: Error beginning a session
    - `415`: Request body not in JSON, Request is nil
    - `500`: Decoding failed, Internal server error

- `DELETE /sessions/`: deletes the session
  - Request headers:
    - `Authorization`: bearer token for the session
  - Responses:
    - `200`: signed out
    - `403`: User not authenticated
    - `405`: Method must be DELETE
    - `409`: Error ending session

- `/`: upgrades connection to websocket
  - Responses:
    - `500`: Cannot upgrade to websocket, Cannot read json

## WebSocket Messages
Websocket will connect when the client joins the waiting room (game tab). The client sends the `auth` token recieved from the `/session` endpoint. 

The client can then send the following data to the server through the websocket connection:
``` Javascript
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
``` Javascript
{
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
}
```
For a single player game, the `players` array will only contain one element, for multi-player it would contain two. The `body` array contains points representing the location of the player's snake, the 0 element being the head. The `food` field contains a single point representing where the food is located. 

## Database Schema

The `users` table stores all registered users. We chose to only store username and not email because we would never contact the user.

| users                                 |
|---------------------------------------|
| **`id`** `int`                        |
| **`username`** `varchar(255), unique` |
| **`passhash`** `varchar(128)`         |


The `scores` table stores all scores of a registered user. The `scores.userID` links to `users.id` of the users table.

| scores                          |
|---------------------------------|
| **`id`** `int`                  |
| **`userId`** `int, foreign key` |
| **`score`** `int`               |

## Docker Containers
- `snake-server`
  - **Port:** 443
  - **Docker Network:** server-net
  - **Description:** This container is the main gateway for our API server.

- `user-store`
  - **Port:** 3306 (not published)
  - **Docker Network:** server-net
  - **Description:** This container is the SQL database which stores registered users and scores.

- `redisServer`
  - **Port:** 6379 (not published)
  - **Docker Network:** server-net
  - **Description:** This container is the redis store which contains user sessions.

- `client`
  - **Port:** 80, 443
  - **Docker Network:** N/A
  - **Description:** This container is our client-side react app.