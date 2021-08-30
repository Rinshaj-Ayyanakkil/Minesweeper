import { EMOJI } from "./utils.js";
export class Cell {
    position;
    isMine = false;
    _open = false;
    _flagged = false;
    constructor(position) {
        this.position = position;
        this._open = false;
    }
    get element() {
        const element = document.querySelector(`div[data-row-id="${this.position.row}"][data-col-id="${this.position.col}"]`);
        return element ? element : document.createElement("div");
    }
    get isFlagged() {
        return this._flagged;
    }
    toggleFlagged() {
        this._flagged = !this._flagged;
        if (this._flagged) {
            this.element.innerText = EMOJI.FLAG;
        }
        else {
            this.element.innerText = "";
        }
        return this._flagged;
    }
    get isOpen() {
        return this._open;
    }
    open(cellText) {
        this._open = true;
        this.element.dataset.status = "opened";
        this.element.innerText = cellText;
    }
}
