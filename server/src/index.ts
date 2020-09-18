// import GameController from "./GameController";

import GameController from "./GameController";
import Server from "./Server";

const game = new GameController(3, 5);

const server = new Server(game);
server.startServer(9000);