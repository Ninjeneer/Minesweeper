import MineSweeper, { Cell } from "./Minesweeper";

export default class GameController {
    private game: MineSweeper;

    constructor(size: number, nbBombs: number) {
        this.game = new MineSweeper(size, nbBombs);
    }

    public pick(row: number, col: number): boolean {
        if (row < 0 || row > this.game.getSize() || col < 0 || col > this.game.getSize()) {
            throw new Error('Out of bounds');
        }

        return this.game.pick(row, col);
    }

    public displayGrid() {
        console.log('--------')  
        this.game.getGrid().forEach(line => {
            console.log(line.map(cell => cell.value).join(' '));
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

    public getPlayerGrid() {
        return this.game.getPlayerGrid();
    }

    public resetGame(size: number, nbBombs: number) {
        this.game = new MineSweeper(size, nbBombs)
    }
}