import { getNumberedImage } from '../../helper/imageLoader.js';
import { getRandomBoolean, getRandomValue } from '../../helper/randomHelper.js';
import Game from '../Game/Game.js';
import GameSettings from '../../constants.js';
import SetPieceGenerator from './setPieces/SetPieceGenerator.js';

export default class MapGenerator {
    constructor(camera) {
        this.lowerLayers = camera.lowerLayers;
    }

    init() {
        for (let i = 0; i < 1280; i += 128) {
            for (let j = 0; j < 1280; j += 128) {
                const x = Math.round(i / 128);
                const y = Math.round(j / 128);

                this.generateSetPiece(x, y);
                this.lowerLayers.set(`${x},${y}`, this.getFloorImage());
            }
        }
    }

    generateSetPiece(x, y) {
        if (!getRandomBoolean(0.3)) {
            return;
        }

        SetPieceGenerator.generate({ x, y });
    }

    update() {
        this.generateFloor();
    }

    getFloorImage() {
        if (getRandomBoolean(0.8)) {
            return getNumberedImage('forest_floor', 1);
        }

        return getNumberedImage(
            'forest_floor',
            getRandomValue({
                initialValue: 1,
                randomValue: 7,
                rounded: true,
            }),
        );
    }

    generateFloor() {
        const { camera, player } = Game.getInstance();

        const pos1 = {
            x: player.centerPosition.x - 128 * 5,
            y: player.centerPosition.y - 128 * 5,
        };
        const pos2 = {
            x: player.centerPosition.x + 128 * 5,
            y: player.centerPosition.y + 128 * 5,
        };
        //
        for (let i = pos1.x - 128; i <= pos2.x + 128; i += 128) {
            for (let j = pos1.y - 128; j <= pos2.y + 128; j += 128) {
                const x = Math.round(i / (128 * GameSettings.GAME.GAME_SCALE));
                const y = Math.round(j / (128 * GameSettings.GAME.GAME_SCALE));

                if (this.lowerLayers.has(`${x},${y}`)) {
                    continue;
                }

                this.generateSetPiece(x, y);

                this.lowerLayers.set(`${x},${y}`, this.getFloorImage());
            }
        }
    }
}
