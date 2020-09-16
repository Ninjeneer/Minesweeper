import GameController from "./GameController";

const game = new GameController(10, 7);
game.displayGrid();
game.pick(2, 2);
game.displayGrid();

