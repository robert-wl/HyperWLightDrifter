import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import SetPieceGenerator from './setPieces/SetPieceGenerator.js';
import PieceFactory from './setPieces/PieceFactory.js';
import AssetManager from '../utility/manager/AssetManager.js';
import RandomHelper from '../utility/helper/RandomHelper.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
export default class MapGenerator {
    private lowerLayers: Map<string, HTMLImageElement>;
    private pieceFactory: PieceFactory;
    private setPieceGenerator: SetPieceGenerator;

    constructor(game: Game) {
        const { interactablesFactory, camera, enemyManager } = game;
        this.lowerLayers = camera.lowerLayers;
        this.pieceFactory = new PieceFactory();
        this.setPieceGenerator = new SetPieceGenerator(this.pieceFactory, interactablesFactory, enemyManager.enemyFactory);
    }

    init() {
        const { FLOOR_WIDTH } = GameSettings.GAME.FOREST_STAGE;
        for (let i = 0; i < FLOOR_WIDTH * 3; i += FLOOR_WIDTH) {
            for (let j = 0; j < FLOOR_WIDTH * 3; j += FLOOR_WIDTH) {
                const x = Math.round(i / FLOOR_WIDTH);
                const y = Math.round(j / FLOOR_WIDTH);

                this.setPieceGenerator.generate({ x, y }, true);
                this.lowerLayers.set(`${x},${y}`, this.getFloorImage());
            }
        }
    }

    update() {
        this.generateChunks();
    }

    getFloorImage(elevator = false) {
        if (elevator) {
            return AssetManager.getImage('forest_floor_elevator');
        }

        if (RandomHelper.getRandomBoolean(0.5)) {
            return AssetManager.getNumberedImage('forest_floor', 1);
        }

        return AssetManager.getNumberedImage('forest_floor', RandomHelper.randomValue(1, 7, true));
    }

    generateChunks() {
        const { player } = Game.getInstance();
        const { FLOOR_WIDTH, GENERATE_DISTANCE } = GameSettings.GAME.FOREST_STAGE;

        const pos1 = {
            x: player.centerPosition.x - FLOOR_WIDTH * GENERATE_DISTANCE,
            y: player.centerPosition.y - FLOOR_WIDTH * GENERATE_DISTANCE,
        };
        const pos2 = {
            x: player.centerPosition.x + FLOOR_WIDTH * GENERATE_DISTANCE,
            y: player.centerPosition.y + FLOOR_WIDTH * GENERATE_DISTANCE,
        };
        for (let i = pos1.x - FLOOR_WIDTH; i <= pos2.x + FLOOR_WIDTH; i += FLOOR_WIDTH) {
            for (let j = pos1.y - FLOOR_WIDTH; j <= pos2.y + FLOOR_WIDTH; j += FLOOR_WIDTH) {
                const x = Math.round(i / (FLOOR_WIDTH * GameSettings.GAME.GAME_SCALE));
                const y = Math.round(j / (FLOOR_WIDTH * GameSettings.GAME.GAME_SCALE));

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

        const chance = Math.min(SETPIECE_ELEVATOR_INITIAL_CHANCE + Game.getInstance().keyCount * 0.0005, SETPIECE_ELEVATOR_MAX_CHANCE);

        if (RandomHelper.getRandomBoolean(chance)) {
            this.lowerLayers.set(`${x},${y}`, this.getFloorImage(true));
            this.setPieceGenerator.generateElevator({ x, y });

            for (let i = 0; i < 8; i++) {
                this.lowerLayers.set(`${x + directionX[i]},${y + directionY[i]}`, this.getFloorImage());
            }
            return true;
        }

        return false;
    }

    generateNormalFloor({ x, y }) {
        this.lowerLayers.set(`${x},${y}`, this.getFloorImage());

        this.setPieceGenerator.generate({ x, y });
    }
}
