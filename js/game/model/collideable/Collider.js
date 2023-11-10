import Game from '../game/Game.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
export default class Collider {
    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.number = 0;
        this.animationStage = 1;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    renderDebug() {
        DrawHelper.setFillStyle('rgb(0, 255, 0, 0.2)');
        DrawHelper.drawRectangle(new Box(this._x, this._y, this._width, this._height));
    }
    checkCollision({ x, y, w, h }) {
        if (Game.renderCollider) {
            this.renderDebug();
        }
        return !(this._x + this._width >= x && this._x <= x + w && this._y + this._height >= y && this._y <= y + h);
    }
    update() {
        if (Game.renderCollider) {
            this.renderDebug();
        }
    }
}
