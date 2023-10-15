import { getImage, getNumberedImage } from '../../helper/imageLoader.js';
import { getRandomBoolean, getRandomValue } from '../../helper/randomHelper.js';
import Game from '../Game/Game.js';
import GameSettings from '../../constants.js';
import SetPieceGenerator from './setPieces/SetPieceGenerator.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
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
        this.generateChunks();
    }

    getFloorImage(elevator = false) {
        if (elevator) {
            return getImage('forest_floor_elevator');
        }

        if (!getRandomBoolean(0.1)) {
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

    generateChunks() {
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

                if (this.generateElevatorFloor({ x, y })) {
                    continue;
                }

                this.generateNormalFloor({ x, y });
            }
        }
    }

    generateElevatorFloor({ x, y }) {
        const { SETPIECE_ELEVATOR_INITIAL_CHANCE, SETPIECE_ELEVATOR_MAX_CHANCE } = GameSettings.GAME.FOREST_STAGE;

        const chance = 0.5 || Math.min(SETPIECE_ELEVATOR_INITIAL_CHANCE + Game.getInstance().keyCount * 0.0005, SETPIECE_ELEVATOR_MAX_CHANCE);

        if (getRandomBoolean(chance)) {
            this.lowerLayers.set(`${x},${y}`, this.getFloorImage(true));
            SetPieceGenerator.generateElevator({ x, y });

            for (let i = 0; i < 8; i++) {
                this.lowerLayers.set(`${x + directionX[i]},${y + directionY[i]}`, this.getFloorImage());
            }
            return true;
        }

        return false;
    }

    generateNormalFloor({ x, y }) {
        this.lowerLayers.set(`${x},${y}`, this.getFloorImage());

        SetPieceGenerator.generate({ x, y });
    }
}
