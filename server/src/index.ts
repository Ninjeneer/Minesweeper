// import GameController from "./GameController";

import GameController from "./GameController";
import MineSweeper from "./Minesweeper";
import Server from "./Server";

const game = new GameController(MineSweeper.DEFAULT_SIZE, 5);

const server = new Server(game);
server.startServer(9000);