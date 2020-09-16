// import GameController from "./GameController";

import Server from "./Server";

// const game = new GameController(10, 7);
// game.displayGrid();
// game.pick(2, 2);
// game.displayGrid();

const server = new Server();
server.startServer(9000);