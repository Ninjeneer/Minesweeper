interface Cell {
    value: string;
    visited: boolean;
}

export default class MineSweeper {
    private grid: Cell[][];
    private playerGrid: string[][];
    private size: number;
    private nbBombs: number;

    constructor(size: number, nbBombs: number) {
        if (nbBombs > size*size) {
            throw new Error("Too much bombs");
        }
        this.grid = [];
        this.playerGrid = [];
        this.size = size + 2;
        this.nbBombs = nbBombs;
        this.generateGrid();
    }

    public pick(row: number, col: number) {
        // Avoid infinite recursive
        if (this.grid[row][col].visited) {
            return;
        }
        // Reveal cell
        this.playerGrid[row][col] = this.grid[row][col].value;
        // Mark as visited
        this.grid[row][col].visited = true; 
        // Visit siblings if 0
        if (this.grid[row][col].value === '0') {
            for (let i = row - 1; i <= row + 1; i++) {
                for (let j = col - 1; j <= col + 1; j++) {
                    this.pick(i, j);
                }
            }
        }
    }

    public getSize() {
        return this.size;
    }

    public getGrid() {
        return this.grid;
    }

    public getPlayerGrid() {
        return this.playerGrid;
    }

    private generateGrid() {
        // Initialize blank values
        for (let i = 0; i < this.size; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < this.size; j++) {
                row.push({ value: '#', visited: false });
            }
            this.grid.push(row);
            this.playerGrid.push(row.map(cell => cell.value));
        }

        // Place bombs
        for (let i = 0; i < this.nbBombs; i++) {
            let row;
            let col; 
            do {
                row = Math.floor(Math.random() * (this.size - 2)) + 1;
                col = Math.floor(Math.random() * (this.size - 2)) + 1;
            } while (row < 0 || row > this.size || col < 0 || col > this.size || this.grid[row][col].value === 'B');
            this.grid[row][col].value = 'B';
        }

        // Place numbers
        for (let i = 1; i < this.size - 1; i++) {
            for (let j = 1; j < this.size - 1; j++) {
                if (this.grid[i][j].value !== 'B') {
                    this.generateCellValue(i, j);
                }
            }
        }
    }

    private generateCellValue(row: number, col: number) {
        let value = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (this.grid[i][j].value === 'B') {
                    value++;
                }    
            }
        }
        this.grid[row][col].value = '' + value;
    }
}

