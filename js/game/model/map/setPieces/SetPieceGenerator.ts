import Game from '../../game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../helper/randomHelper.js';
import SetPiece from './SetPiece.js';
import GameSettings from '../../../constants.js';
import Elevator from '../../interactables/Elevator/Elevator.js';
import PieceFactory from './PieceFactory.js';
import { CombinedPiece } from '../../utility/enums/Piece.js';
import InteractablesFactory from '../../interactables/InteractablesFactory.js';
import EnemyFactory from '../../enemy/EnemyFactory';

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

    public generate(position: Position, forceEmpty = false) {
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

        if (getRandomBoolean(this.treeChance)) {
            this.generateTree(position);
            return;
        }

        if (getRandomBoolean(this.stoneChance)) {
            this.generateStone(position);
            return;
        }

        if (getRandomBoolean(this.enemyChance)) {
            this.generateEnemy(position);
            return;
        }

        if (getRandomBoolean(this.healthChance)) {
            this.generateHealth(position);
            return;
        }

        if (getRandomBoolean(this.plantChance)) {
            this.generatePlants(position);
        }
    }

    public generateElevator({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];

        const objectX = x * FLOOR_WIDTH * GAME_SCALE + (FLOOR_WIDTH * GAME_SCALE) / 2 - x * GAME_SCALE;
        const objectY = y * FLOOR_WIDTH * GAME_SCALE + (FLOOR_WIDTH * GAME_SCALE) / 2 - y * GAME_SCALE + 12;

        const elevator = new Elevator({ x: objectX, y: objectY });

        const key = `${y},${x}`;
        pieces.push(elevator);

        const { objects } = Game.getInstance();
        objects.set(key, new SetPiece(pieces, 'elevator'));

        for (let i = 0; i < 8; i++) {
            const key = `${y + directionY[i]},${x + directionX[i]}`;

            if (!objects.has(key)) {
                continue;
            }

            objects.delete(key);
        }
    }

    private generateHealth({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];

        const objectX = x * FLOOR_WIDTH * GAME_SCALE;
        const objectY = y * FLOOR_WIDTH * GAME_SCALE;

        const healthPiece = this.pieceFactory.generateHealthPiece({ x: objectX, y: objectY });

        const key = `${y},${x}`;
        pieces.push(healthPiece);
        pieces.push(
            this.interactablesFactory.generateMedkit(
                {
                    x: objectX + healthPiece.collider.width / 2,
                    y: objectY - healthPiece.collider.height / 2,
                },
                key,
            ),
        );

        const random = getRandomValue({
            initialValue: 1,
            randomValue: 5,
            rounded: true,
        });

        const generateAmount = getRandomValue({
            initialValue: 1,
            randomValue: 8,
            rounded: true,
        });

        for (let i = 0; i < generateAmount; i++) {
            const { objectX, objectY } = this.getRandomCoordinates({ x, y });
            pieces.push(this.pieceFactory.generatePlantsPiece({ x: objectX, y: objectY }, random));
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, 'health'));
    }

    private generateEnemy({ x, y }) {
        const pieces: CombinedPiece[] = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const { objectX, objectY } = this.getRandomCoordinates({ x, y });

            pieces.push(this.pieceFactory.generateEnemyPiece({ x: objectX, y: objectY }));

            this.enemyFactory.generateEnemy({ x: objectX, y: objectY });
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'enemy'));
    }

    private generateTree({ x, y }) {
        const pieces: CombinedPiece[] = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const { objectX, objectY } = this.getRandomCoordinates({ x, y });

            if (getRandomBoolean(0.4)) {
                pieces.push(this.pieceFactory.generateLargeTreePiece({ x: objectX, y: objectY }));
            }

            pieces.push(this.pieceFactory.generateTreePiece({ x: objectX, y: objectY }));
        }

        if (getRandomBoolean(0.85)) {
            Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'tree'));
            return;
        }

        const generateAmount = getRandomValue({
            initialValue: 1,
            randomValue: 8,
            rounded: true,
        });

        for (let i = 0; i < generateAmount; i++) {
            const { objectX, objectY } = this.getRandomCoordinates({ x, y });

            const random = getRandomValue({
                initialValue: 1,
                randomValue: 5,
                rounded: true,
            });

            pieces.push(this.pieceFactory.generatePlantsPiece({ x: objectX, y: objectY }, random));
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'tree'));
    }

    private generateStone({ x, y }) {
        const pieces: CombinedPiece[] = [];
        const { objectX, objectY } = this.getRandomCoordinates({ x, y });

        if (getRandomBoolean(0.4)) {
            pieces.push(this.pieceFactory.generateLargeStonePiece({ x: objectX, y: objectY }));

            Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'stone'));
            return;
        }

        for (let i = 0; i < Math.random() * 3; i++) {
            const { objectX, objectY } = this.getRandomCoordinates({ x, y });

            pieces.push(this.pieceFactory.generateStonePiece({ x: objectX, y: objectY }));
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'stone'));
    }

    private updateChance(position: Position) {
        const { objects } = Game.getInstance();
        for (let i = 0; i < 8; i++) {
            const key = `${position.y + directionY[i]},${position.x + directionX[i]}`;

            if (!objects.has(key)) {
                continue;
            }
            if (objects.get(key).type === 'tree') {
                this.treeChance += 0.1;
                this.healthChance += 0.05;
                this.stoneChance += 0.05;
                continue;
            }
            if (objects.get(key).type === 'enemy') {
                this.enemyChance += 0.05;
                this.treeChance -= 0.2;
                this.stoneChance -= 0.01;
                continue;
            }
            if (objects.get(key).type === 'health') {
                this.treeChance = 0;
                this.healthChance = 0;
                this.stoneChance = 0;
            }
            if (objects.get(key).type === 'elevator') {
                this.treeChance = 0;
                this.enemyChance = 0;
                this.healthChance = 0;
                this.stoneChance = 0;
            }
            if (objects.get(key).type === 'stone') {
                this.treeChance += 0.05;
                this.healthChance += 0.05;
                this.stoneChance += 0.2;
            }
        }
    }

    private generatePlants(position: Position) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces: CombinedPiece[] = [];
        const key = `${position.y},${position.x}`;

        const random = getRandomValue({
            initialValue: 1,
            randomValue: 5,
            rounded: true,
        });

        const generateAmount = getRandomValue({
            initialValue: 1,
            randomValue: 8,
            rounded: true,
        });

        for (let i = 0; i < generateAmount; i++) {
            const objectX = position.x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;
            const objectY = position.y * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;

            pieces.push(this.pieceFactory.generatePlantsPiece({ x: objectX, y: objectY }, random));
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, 'plant'));
    }

    private getRandomCoordinates({ x, y }, distance = 0) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        distance = distance || FLOOR_WIDTH;

        const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3;
        const objectY = y * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3;

        return { objectX, objectY };
    }
}
