import { Board } from "./board.js";
import { EMOJI } from "./utils.js";
function renderBoard(board) {
    const flagCountElement = document.querySelector("#flag-count");
    const mines = board.mineCount.toString();
    if (flagCountElement)
        flagCountElement.innerText = `${EMOJI.FLAG}: ${mines} / ${mines}`;
    const boardElement = document.createElement("div");
    boardElement.classList.add("board");
    boardElement.style.setProperty("--size", board.size.toString());
    board.cells.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.rowId = i.toString();
            cellElement.dataset.colId = j.toString();
            cellElement.dataset.status = "closed";
            cellElement.addEventListener("click", (e) => {
                board.revealCell(cell);
            });
            cellElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                board.flagCell(cell);
            });
            boardElement.append(cellElement);
        });
    });
    boardElement.style.setProperty("--size", board.size.toString());
    const containerElement = document.querySelector(".board-container");
    if (!containerElement)
        return;
    containerElement.append(boardElement);
}
function createBoard(size, mineCount) {
    document.querySelector(".board")?.remove();
    document.querySelector("#end-msg")?.remove();
    renderBoard(new Board(size, mineCount));
}
const boardTypes = [
    { level: "easy", size: 8, mines: 8 },
    { level: "medium", size: 16, mines: 40 },
    { level: "hard", size: 30, mines: 225 },
];
boardTypes.forEach((type) => {
    const button = document.createElement("button");
    button.innerText = `${type.level}\n${type.size}x${type.size}`;
    button.addEventListener("click", (e) => {
        createBoard(type.size, type.mines);
    });
    document.querySelector("#sizes")?.append(button);
});
renderBoard(new Board(boardTypes[0].size, boardTypes[0].mines));
