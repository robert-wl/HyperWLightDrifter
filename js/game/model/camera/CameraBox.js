import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
import { Box } from '../utility/interfaces/Box.js';
const CAMERA_X_CONSTANT = -45;
const CAMERA_Y_CONSTANT = -25;
export default class CameraBox {
    constructor(game) {
        this.game = game;
        this.position = {
            x: 0,
            y: 0,
        };
        this._width = 800;
        this._height = 500;
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
    update() {
        const { player } = this.game;
        this.position.x = this.getTranslatePosition({
            position: player.centerPosition.x,
            length: this._width / 2 + CAMERA_X_CONSTANT,
        });
        this.position.y = this.getTranslatePosition({
            position: player.centerPosition.y,
            length: this._height / 2 + CAMERA_Y_CONSTANT,
        });
        if (Game.debug) {
            this.renderDebugBox();
        }
    }
    renderDebugBox() {
        DrawHelper.setFillStyle(GameSettings.DEBUG.COLOR.CAMERA_BOX);
        DrawHelper.drawRectangle(new Box(this.position.x, this.position.y, this._width, this._height));
    }
    getOverlap(points) {
        const directionArray = [];
        const { top, bottom, left, right } = this.getSides();
        if (right > points.right) {
            directionArray.push('d');
        }
        if (left < points.left) {
            directionArray.push('a');
        }
        if (bottom > points.bottom) {
            directionArray.push('s');
        }
        if (top < points.top) {
            directionArray.push('w');
        }
        return directionArray;
    }
    getTranslatePosition({ position, length }) {
        return position - length;
    }
    getSides() {
        return {
            top: this.position.y,
            bottom: this.position.y + this._height,
            left: this.position.x,
            right: this.position.x + this._width,
        };
    }
}
