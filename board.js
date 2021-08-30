import { Cell } from "./cell.js";
import { EMOJI, randomNumber } from "./utils.js";
export class Board {
    size;
    mineCount;
    cells = [];
    openedCells = 0;
    flaggedCells = 0;
    constructor(size, mineCount) {
        this.size = size;
        this.mineCount = mineCount;
        this.populate();
    }
    populate() {
        this.addCells();
        this.plantMines();
    }
    addCells() {
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(new Cell({ row: i, col: j }));
            }
            this.cells.push(row);
        }
    }
    plantMines() {
        let minesPlanted = 0;
        while (minesPlanted < this.mineCount) {
            const randomCell = this.cells[randomNumber(this.size)][randomNumber(this.size)];
            if (!randomCell.isMine) {
                randomCell.isMine = true;
                minesPlanted++;
            }
        }
    }
    //flag a cell
    flagCell(cell) {
        const isFlagged = cell.toggleFlagged();
        isFlagged ? this.flaggedCells++ : this.flaggedCells--;
        const flagCountElement = document.querySelector("#flag-count");
        if (flagCountElement)
            flagCountElement.innerText = `${EMOJI.FLAG}: ${this.mineCount - this.flaggedCells} / ${this.mineCount}`;
    }
    // reveal a given cell
    revealCell(cell) {
        // check if the cell is already opened or flagged
        if (cell.isOpen || cell.isFlagged)
            return;
        // check if cell is mine
        if (cell.isMine) {
            this.revealMines(cell);
            this.endGame(false);
            return;
        }
        const adjacentCells = this.getAdjacentCells(cell);
        const adjacentMinesCount = adjacentCells.filter((cell) => cell.isMine).length;
        // recursively open the adjacent cells if count of adjacent mines are 0
        if (adjacentMinesCount === 0) {
            cell.open("");
            adjacentCells.forEach((cell) => this.revealCell(cell));
        }
        else {
            cell.open(adjacentMinesCount.toString());
        }
        // check if game is won
        // if number of unopened cell = number of mines, game is won
        this.openedCells++;
        if (this.size * this.size - this.openedCells === this.mineCount) {
            this.endGame(true);
            return;
        }
    }
    // get the list of 8 adjacent cells of a given cell
    getAdjacentCells(cell) {
        let adjacentCells = [];
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const adjacentCell = this.cells[cell.position.row + rowOffset]?.[cell.position.col + colOffset];
                if (adjacentCell)
                    adjacentCells.push(adjacentCell);
            }
        }
        return adjacentCells;
    }
    // reveal all the mines
    revealMines(explodedCell) {
        this.cells.forEach((row) => row.forEach((cell) => {
            if (cell.isMine)
                cell.open(EMOJI.BOMB);
        }));
    }
    endGame(isWin) {
        const boardElement = document.querySelector(".board");
        if (!boardElement)
            return;
        boardElement.addEventListener("click", (e) => e.stopImmediatePropagation(), {
            capture: true,
        });
        boardElement.addEventListener("contextmenu", (e) => e.stopImmediatePropagation(), { capture: true });
        const panelElement = document.querySelector("div#panel");
        if (!panelElement)
            return;
        const endMessageElement = document.createElement("p");
        endMessageElement.id = "end-msg";
        endMessageElement.innerText = isWin
            ? `You Won!${EMOJI.PARTY_FACE}`
            : `You Lost!${EMOJI.FROWNY_FACE}`;
        panelElement.append(endMessageElement);
    }
}
