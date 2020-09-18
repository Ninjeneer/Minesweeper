import MineSweeper from "./Minesweeper";

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
        this.game.getPlayerGrid().forEach(line => {
            console.log(line.join(' '));
        })
    }
}