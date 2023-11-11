import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
import Game from '../game/Game.js';

export default class Collider {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private number: number;
    private animationStage: number;

    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.number = 0;
        this.animationStage = 1;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    renderDebug() {
        DrawHelper.setFillStyle('rgb(0, 255, 0, 0.2)');
        DrawHelper.drawRectangle(new Box(this._x, this._y, this._width, this._height));
    }

    public checkCollision({ x, y, w, h }: Box) {
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
