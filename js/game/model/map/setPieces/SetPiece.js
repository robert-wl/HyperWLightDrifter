import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import { getRandomValue } from '../../../helper/randomHelper.js';

export default class SetPiece {
    constructor(x, y) {
        const { FLOOR_WIDTH, GAME_SCALE } = GameSettings.GAME;
        this.x =
            x * FLOOR_WIDTH * GAME_SCALE +
            getRandomValue({
                initialValue: 0,
                randomValue: 128,
            });
        this.y =
            y * FLOOR_WIDTH * GAME_SCALE +
            getRandomValue({
                initialValue: 0,
                randomValue: 128,
            });

        this.image = null;
    }

    update() {
        this.drawImage();
    }

    drawImage() {
        if (this.image === null) {
            return;
        }
        drawImage({
            img: this.image,
            x: this.x,
            y: this.y,
            width: this.image.width * GameSettings.GAME.GAME_SCALE,
            height: this.image.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
