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
        const { FLOOR_WIDTH } = GameSettings.GAME.FOREST_STAGE;
        for (let i = 0; i < FLOOR_WIDTH * 3; i += FLOOR_WIDTH) {
            for (let j = 0; j < FLOOR_WIDTH * 3; j += FLOOR_WIDTH) {
                const x = Math.round(i / FLOOR_WIDTH);
                const y = Math.round(j / FLOOR_WIDTH);

                SetPieceGenerator.generate({ x, y }, true);
                this.lowerLayers.set(`${x},${y}`, this.getFloorImage());
            }
        }
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

                SetPieceGenerator.generate({ x, y });

                this.lowerLayers.set(`${x},${y}`, this.getFloorImage());
            }
        }
    }
}
