import MineSweeper, { Cell, GameState } from "./Minesweeper";

import Player from "./Player";

export default class GameController {
    private game: MineSweeper;
    private players: Player[] = [];

    constructor(size: number, nbBombs: number) {
        this.game = new MineSweeper(size, nbBombs);
    }

    public pick(row: number, col: number, player: Player): GameState {
        if (row < 0 || row > this.game.getSize() || col < 0 || col > this.game.getSize()) {
            return GameState.CONTINUE;
        }

        return this.game.pick(row, col, player);
    }

    public flag(row: number, col: number) {
        if (row < 0 || row > this.game.getSize() || col < 0 || col > this.game.getSize()) {
            return GameState.CONTINUE;
        }

        this.game.flag(row, col);
    }

    public displayGrid() {
        console.log('--------')  
        this.game.getGrid().forEach(line => {
            console.log(line.map(cell => cell.value + "|" + (cell.visited ? '1' : '0')).join(' '));
        })
    }

    public getGrid() {
        const grid: Cell[][] = [];
        this.game.getGrid().forEach(line => {
            grid.push(line.filter(cell => cell.value !== '#'));
        });
        grid.pop();
        grid.shift();
        return grid;
    }

    public getRemainingBombs() {
        return this.game.getRemainingBombs();
    }

    public getPlayerGrid() {
        const grid: Cell[][] = [];
        for (let i = 1; i < this.game.getPlayerGrid().length - 1; i++) {
            const row = [];
            for (let j = 1; j < this.game.getPlayerGrid().length - 1; j++) {
                row.push(this.game.getPlayerGrid()[i][j]);
            }
            grid.push(row);
        }
        return grid;
    }

    public resetGame(size: number, nbBombs: number) {
        this.game = new MineSweeper(size, nbBombs)
    }

    public getGameProps() {
        return {
            size: this.game.getSize(),
            nbBombs: this.game.getNbBombs()
        };
    }

    public getPlayers() {
        return this.players;
    }

    public addPlayer(id: string, pseudo: string) {
        const p = new Player(id, pseudo);
        this.players.push(p);
        return p;
    }

    public removePlayer(id: string) {
        this.players = this.players.filter(player => player.getUuid() !== id);
    }

    public resetPlayerScores() {
        this.players.forEach(player => player.resetScore());
    }
}