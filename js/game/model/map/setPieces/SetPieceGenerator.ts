import Game from '../../game/Game.js';
import SetPiece from './SetPiece.js';
import GameSettings from '../../../constants.js';
import PieceFactory from './PieceFactory.js';
import { CombinedPiece } from '../../utility/interfaces/Piece.js';
import InteractablesFactory from '../../interactables/InteractablesFactory.js';
import EnemyFactory from '../../enemy/EnemyFactory.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import { SetpieceType } from '../../utility/enums/SetpieceType.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
export default class SetPieceGenerator {
    private pieceFactory: PieceFactory;
    private interactablesFactory: InteractablesFactory;
    private enemyFactory: EnemyFactory;
    private treeChance: number;
    private enemyChance: number;
    private healthChance: number;
    private plantChance: number;
    private stoneChance: number;

    public constructor(pieceFactory: PieceFactory, interactablesFactory: InteractablesFactory, enemyFactory: EnemyFactory) {
        this.treeChance = 0;
        this.enemyChance = 0;
        this.healthChance = 0;
        this.plantChance = 0;
        this.stoneChance = 0;
        this.pieceFactory = pieceFactory;
        this.interactablesFactory = interactablesFactory;
        this.enemyFactory = enemyFactory;
    }

    public generate(position: Vector, forceEmpty = false) {
        if (forceEmpty) {
            return;
        }

        const { SETPIECE_STONES_INITIAL_CHANCE, SETPIECE_TREE_INITIAL_CHANCE, SETPIECE_ENEMY_INITIAL_CHANCE, SETPIECE_HEALTH_INITIAL_CHANCE, SETPIECE_PLANTS_INITIAL_CHANCE } = GameSettings.GAME.FOREST_STAGE;

        this.treeChance = SETPIECE_TREE_INITIAL_CHANCE;
        this.enemyChance = SETPIECE_ENEMY_INITIAL_CHANCE;
        this.healthChance = SETPIECE_HEALTH_INITIAL_CHANCE;
        this.plantChance = SETPIECE_PLANTS_INITIAL_CHANCE;
        this.stoneChance = SETPIECE_STONES_INITIAL_CHANCE;
        this.updateChance(position);

        if (RandomHelper.getRandomBoolean(this.treeChance)) {
            this.generateTree(position);
            return;
        }

        if (RandomHelper.getRandomBoolean(this.stoneChance)) {
            this.generateStone(position);
            return;
        }

        if (RandomHelper.getRandomBoolean(this.enemyChance)) {
            this.generateEnemy(position);
            return;
        }

        if (RandomHelper.getRandomBoolean(this.healthChance)) {
            this.generateHealth(position);
            return;
        }

        if (RandomHelper.getRandomBoolean(this.plantChance)) {
            this.generatePlants(position);
        }
    }

    public generateElevator(position: Vector) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];

        const elevatorPosition = Vector.parse({
            x: position.x * FLOOR_WIDTH * GAME_SCALE + (FLOOR_WIDTH * GAME_SCALE) / 2 - position.x * GAME_SCALE,
            y: position.y * FLOOR_WIDTH * GAME_SCALE + (FLOOR_WIDTH * GAME_SCALE) / 2 - position.y * GAME_SCALE + 12,
        });

        const elevator = this.interactablesFactory.generateElevator(elevatorPosition);

        const key = Vector.toKey(position);
        pieces.push(elevator);

        const { objects } = Game.getInstance();
        objects.set(key, new SetPiece(pieces, SetpieceType.ELEVATOR));

        for (let i = 0; i < 8; i++) {
            const positionTwo = Vector.add(position, new Vector(directionX[i], directionY[i]));

            const key = Vector.toKey(positionTwo);

            if (!objects.has(key)) {
                continue;
            }

            objects.delete(key);
        }
    }

    private generateHealth(position: Vector) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];

        const healthPosition = Vector.parse({
            x: position.x * FLOOR_WIDTH * GAME_SCALE,
            y: position.y * FLOOR_WIDTH * GAME_SCALE,
        });

        const healthPiece = this.pieceFactory.generateHealthPiece(healthPosition);

        const key = Vector.toKey(position);
        const medkitPosition = Vector.parse({
            x: healthPosition.x + healthPiece.collider!.width / 2,
            y: healthPosition.y - healthPiece.collider!.height / 2,
        });

        pieces.push(healthPiece);
        pieces.push(this.interactablesFactory.generateMedkit(medkitPosition, key));

        const random = RandomHelper.randomValue(1, 5, true);

        const generateAmount = RandomHelper.randomValue(1, 8, true);

        for (let i = 0; i < generateAmount; i++) {
            const plantPosition = this.getRandomCoordinates(position);
            pieces.push(this.pieceFactory.generatePlantsPiece(plantPosition, random));
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, SetpieceType.HEALTH));
    }

    private generateEnemy(position: Vector) {
        const pieces: CombinedPiece[] = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const enemyPosition = this.getRandomCoordinates(position);

            pieces.push(this.pieceFactory.generateEnemyPiece(enemyPosition));

            this.enemyFactory.generateEnemy(Vector.copy(enemyPosition));
        }

        Game.getInstance().objects.set(Vector.toKey(position), new SetPiece(pieces, SetpieceType.ENEMY));
    }

    private generateTree(position: Vector) {
        const pieces: CombinedPiece[] = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const treePosition = this.getRandomCoordinates(position);

            if (RandomHelper.getRandomBoolean(0.4)) {
                pieces.push(this.pieceFactory.generateLargeTreePiece(treePosition));
            }

            pieces.push(this.pieceFactory.generateTreePiece(treePosition));
        }

        if (RandomHelper.getRandomBoolean(0.85)) {
            Game.getInstance().objects.set(Vector.toKey(position), new SetPiece(pieces, SetpieceType.TREE));
            return;
        }

        const generateAmount = RandomHelper.randomValue(1, 8, true);

        for (let i = 0; i < generateAmount; i++) {
            const plantPosition = this.getRandomCoordinates(position);

            const random = RandomHelper.randomValue(1, 5, true);

            pieces.push(this.pieceFactory.generatePlantsPiece(plantPosition, random));
        }

        Game.getInstance().objects.set(Vector.toKey(position), new SetPiece(pieces, SetpieceType.TREE));
    }

    private generateStone(position: Vector) {
        const pieces: CombinedPiece[] = [];
        const stonePosition = this.getRandomCoordinates(position);

        if (RandomHelper.getRandomBoolean(0.4)) {
            pieces.push(this.pieceFactory.generateLargeStonePiece(stonePosition));

            Game.getInstance().objects.set(Vector.toKey(position), new SetPiece(pieces, SetpieceType.STONE));
            return;
        }

        for (let i = 0; i < Math.random() * 3; i++) {
            const plantPosition = this.getRandomCoordinates(position);

            pieces.push(this.pieceFactory.generateStonePiece(plantPosition));
        }

        Game.getInstance().objects.set(Vector.toKey(position), new SetPiece(pieces, SetpieceType.STONE));
    }

    private updateChance(position: Vector) {
        const { objects } = Game.getInstance();
        for (let i = 0; i < 8; i++) {
            const positionTwo = Vector.add(position, new Vector(directionX[i], directionY[i]));
            const key = Vector.toKey(positionTwo);

            if (!objects.has(key)) {
                continue;
            }
            if (objects.get(key)?.type === SetpieceType.TREE) {
                this.treeChance += 0.1;
                this.healthChance += 0.05;
                this.stoneChance += 0.05;
                continue;
            }
            if (objects.get(key)?.type === SetpieceType.ENEMY) {
                this.enemyChance += 0.05;
                this.treeChance -= 0.2;
                this.stoneChance -= 0.01;
                continue;
            }
            if (objects.get(key)?.type === SetpieceType.HEALTH) {
                this.treeChance = 0;
                this.healthChance = 0;
                this.stoneChance = 0;
            }
            if (objects.get(key)?.type === SetpieceType.ELEVATOR) {
                this.treeChance = 0;
                this.enemyChance = 0;
                this.healthChance = 0;
                this.stoneChance = 0;
            }
            if (objects.get(key)?.type === SetpieceType.ELEVATOR) {
                this.treeChance += 0.05;
                this.healthChance += 0.05;
                this.stoneChance += 0.2;
            }
        }
    }

    private generatePlants(position: Vector) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];
        const key = Vector.toKey(position);

        const random = RandomHelper.randomValue(1, 5, true);

        const generateAmount = RandomHelper.randomValue(1, 8, true);

        for (let i = 0; i < generateAmount; i++) {
            const plantPosition = Vector.parse({
                x: position.x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3,
                y: position.y * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3,
            });

            pieces.push(this.pieceFactory.generatePlantsPiece(plantPosition, random));
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, SetpieceType.PLANT));
    }

    private getRandomCoordinates(position: Vector, distance = 0) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        distance = distance || FLOOR_WIDTH;

        return Vector.parse({
            x: position.x * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3,
            y: position.y * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3,
        });
    }
}
