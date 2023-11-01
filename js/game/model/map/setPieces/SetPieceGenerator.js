import Game from '../../Game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../helper/randomHelper.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import Collider from '../../collideable/Collider.js';
import SetPiece from './SetPiece.js';
import GameSettings from '../../../constants.js';
import Medkit from '../../interactables/Medkit.js';
import EnemyManager from '../../enemy/EnemyManager.js';
import Elevator from '../../interactables/Elevator/Elevator.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
export default class SetPieceGenerator {
    static generate(position, forceEmpty = false) {
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

    static generatePlants({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];
        const key = `${y},${x}`;

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
            const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;
            const objectY = y * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;

            pieces.push(
                plants(
                    {
                        x: objectX,
                        y: objectY,
                    },
                    random,
                ),
            );
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, 'plant'));
    }

    static generateElevator({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];

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

    static updateChance(position) {
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

    static generateStone({ x, y }) {
        const pieces = [];
        const { objectX, objectY } = getRandomCoordinates({ x, y });

        if (getRandomBoolean(0.4)) {
            pieces.push(
                largeStone({
                    x: objectX,
                    y: objectY,
                }),
            );

            Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'stone'));
            return;
        }

        for (let i = 0; i < Math.random() * 3; i++) {
            const { objectX, objectY } = getRandomCoordinates({ x, y });

            pieces.push(stone({ x: objectX, y: objectY }));
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'stone'));
    }

    static generateTree({ x, y }) {
        const pieces = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const { objectX, objectY } = getRandomCoordinates({ x, y });

            if (getRandomBoolean(0.4)) {
                pieces.push(
                    largeTree({
                        x: objectX,
                        y: objectY,
                    }),
                );
            }

            pieces.push(tree({ x: objectX, y: objectY }));
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
            const { objectX, objectY } = getRandomCoordinates({ x, y });

            const random = getRandomValue({
                initialValue: 1,
                randomValue: 5,
                rounded: true,
            });

            pieces.push(
                plants(
                    {
                        x: objectX,
                        y: objectY,
                    },
                    random,
                ),
            );
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'tree'));
    }

    static generateEnemy({ x, y }) {
        const pieces = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const { objectX, objectY } = getRandomCoordinates({ x, y });

            pieces.push(enemy({ x: objectX, y: objectY }));

            EnemyManager.spawnEnemy({ x: objectX, y: objectY });
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'enemy'));
    }

    static generateHealth({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];

        const objectX = x * FLOOR_WIDTH * GAME_SCALE;
        const objectY = y * FLOOR_WIDTH * GAME_SCALE;

        const healthPiece = health({ x: objectX, y: objectY });

        const key = `${y},${x}`;
        pieces.push(healthPiece);
        pieces.push(
            Medkit.generate(
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
            const { objectX, objectY } = getRandomCoordinates({ x, y });
            pieces.push(
                plants(
                    {
                        x: objectX,
                        y: objectY,
                    },
                    random,
                ),
            );
        }

        Game.getInstance().objects.set(key, new SetPiece(pieces, 'health'));
    }
}

function getRandomCoordinates({ x, y }, distance = null) {
    const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
    const { FLOOR_WIDTH } = FOREST_STAGE;
    distance = distance || FLOOR_WIDTH;

    const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3;
    const objectY = y * FLOOR_WIDTH * GAME_SCALE + Math.random() * distance * 3;

    return { objectX, objectY };
}

function tree(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 8,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_tree', random);

    console.log(image, random);
    const collider = new Collider({
        x: position.x + image.width / 2,
        y: position.y - (4 * image.height) / 6,
        width: image.width,
        height: image.height / 3,
    });
    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}

function plants(position, type) {
    const image = getNumberedImage('set_pieces_plants', type);

    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: null,
    };
}

function largeTree(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 2,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_tree', 6 + random);

    const collider = new Collider({
        x: position.x + (4 * image.width) / 5,
        y: position.y - (3 * image.height) / 5,
        width: image.width / 2,
        height: image.height / 4,
    });

    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}

function stone(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 5,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_stone_small', random);

    const collider = new Collider({
        x: position.x + image.width / 2,
        y: position.y - (4 * image.height) / 6,
        width: image.width,
        height: image.height / 3,
    });
    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}

function largeStone(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 4,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_stone_big', random);

    console.log(image);
    const collider = new Collider({
        x: position.x + image.width / 2,
        y: position.y - (4 * image.height) / 6,
        width: image.width,
        height: image.height / 3,
    });
    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}

function enemy(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 7,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_enemy', random);

    const collider = new Collider({
        x: position.x + (4 * image.width) / 5,
        y: position.y - (3 * image.height) / 5,
        width: image.width / 2,
        height: image.height / 4,
    });

    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}

function health(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 5,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_health', random);

    const collider = new Collider({
        x: position.x + (4 * image.width) / 5,
        y: position.y - (3 * image.height) / 5,
        width: image.width / 2,
        height: image.height / 4,
    });

    return {
        image: image,
        position: position,
        flipped: getRandomBoolean(0.5),
        collider: collider,
    };
}
