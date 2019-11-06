# Snake!
INFO 441 Final Project
Amelia Shull and Kateka Seth

## Project Proposal
### Summary
We are planning on making a multiplayer snake game. Our game will be a positive distraction for college students who need short breaks from long study hours. Our target audience is mainly students, though anyone who experiences boredom can benefit from our game. This game is a positive distraction and not a hindrance because of its simple nature. Users must be actively engaged to succeed in snake, but it’s not interesting enough for long gameplay. As developers (and students!) we are excited to build this game because we would like to play it ourselves and are looking forward to designing the UI.

### Architecture Diagram
![Architecture Diagram](/diagrams/architecture_diagram.jpg)

### Sequence Diagram: single-player game
![Sequence Diagram](/diagrams/sequence_diagram.jpg)

### User Stories

| Priority | User    | Description                                                                                              | Implementation                                                                             |
|----------|---------|----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| P0       | Player  | Play can use arrow keys to move snake around on screen                                                   | **p5.js** to create the game                                                               |
| P0       | Player  | Snake grows in length when it eats food                                                                  | **p5.js**                                                                                  |
| P0       | Player  | Snake bounces of walls                                                                                   | **p5.js**                                                                                  |
| P1       | Players | Player 1 can make a move and player 2 sees the move on their screen                                      | **Websockets** to communicate between client and server                                    |
| P1       | Players | If a snake hit another snake’s body, they lose                                                           | **Websockets** to communicate between client and server, track location of front of snakes |
| P1       | Players | Game ends if two snakes hit head on                                                                      | **Websockets** to communicate between client and server, track location of front of snakes |
| P2       | Players | Players can save their score and view other players score (length of snake) and see other players scores | **mySQL** database to store players scores                                                 |
| P2       | Players | Player can save their number of kills with unique username and see other players number of kills         | **mySQL** database to store players kills                                                  |
| P3       | Players | More than 2 players can play in the same game                                                            | **Websockets** to communicate between client and server                                    |
| P3       | Players | Different levels with collisions on the map                                                              | **mySQL** database to store the levels                                                     |
| P4       | Players | Single player can play against “AI” snake                                                                | Develop logic for which direction the snakes moves, not real AI                            |

### WebSocket Messages
Websocket will connect when the client opens the webpage and send data on the message event. The data the client will send will have the `action` field to specify the action they are requesting. Along with the data, the client will be sending it’s `connectionId`, so the server can recognize the player. This id is generated on connection. Here a an example of the generic information the client will send to the server:
```
{
  action: [action name goes here]
  ...
}
```
**Responses:**
- `200: Successful action`
- `400: Invalid action`
- `500: Internal server error`

#### Possible actions the client can make:
**Enter game action:**
```
{
	action: “enterGame”,
	gameType: “singlePlayer” | “twoPerson”
}
```
**Responses:**
- `200: Successfully enters game`
- `400: Invalid game type`
- `500: Internal server error`

**Move action:**
```
{
	action: “move”,
	gameType: “left” | “right” | “up” | “down”
}
```
**Responses:**
- `200: Successfully move`
- `400: Invalid move`
- `500: Internal server error`

The server will apply the users move to the next change in the game state and respond with the updated state of the game.

### Game State
The state of the game will be calculated and stored in the server. The client simply sends any user actions over websockets. The server will store the game state in an object containing the overall state of the game, and the positions and directions of the snakes and the position of the remaining food. 10 times per second the server will update the game state and send the new state to the client-side to render. Here is an example of the game state:

```
{
  gameState: “onGoing” | “p1” | “p2” | “tie”,
  p1: {
    body:[{x, y}, {x, y}],
    direction: “left” | “right” | “up” | “down”
  }, 
  p2:{
    body: [{x, y}],
    direction: “left” | “right” | “up” | “down”
  },
  food: [{x, y}, {x, y} {x, y}]
}

```

Since the client doesn’t contain any game logic, this will limit potential cheating. 

### Database Schema

| playerScores                 |
|------------------------------|
| **`id`** `int`               |
| **`userId`** `int`           |
| **`username`** `varchar(30)` |
| **`highScore`** `int`        |

| killCounts                   |
|------------------------------|
| **`id`** `int`               |
| **`userId`** `int`           |
| **`username`** `varchar(30)` |
| **`kills`** `int`            |
