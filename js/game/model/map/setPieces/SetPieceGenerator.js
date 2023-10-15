import Game from '../../Game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../helper/randomHelper.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import Collider from '../../collideable/Collider.js';
import SetPiece from './SetPiece.js';
import GameSettings from '../../../constants.js';
import Medkit from '../../interactables/Medkit.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
export default class SetPieceGenerator {
    static generate(position, forceEmpty = false) {
        if (forceEmpty) {
            return;
        }

        const { TREE_INITIAL_CHANCE, ENEMY_INITIAL_CHANCE, HEALTH_INITIAL_CHANCE } = GameSettings.GAME.FOREST_STAGE;
        this.treeChance = TREE_INITIAL_CHANCE;
        this.enemyChance = ENEMY_INITIAL_CHANCE;
        this.healthChance = HEALTH_INITIAL_CHANCE;

        this.updateChance(position);

        if (getRandomBoolean(this.treeChance)) {
            this.generateTree(position);
            return;
        }

        if (getRandomBoolean(this.enemyChance)) {
            this.generateEnemy(position);
            return;
        }

        if (getRandomBoolean(this.healthChance)) {
            this.generateHealth(position);
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
            }
            if (objects.get(key).type === 'enemy') {
                this.enemyChance += 0.05;
                this.treeChance -= 0.2;
            }
            if (objects.get(key).type === 'health') {
                this.treeChance = 0;
                this.healthChance = 0;
            }
        }
    }

    static generateTree({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;
            const objectY = y * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;

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

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'tree'));
    }

    static generateEnemy({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;
            const objectY = y * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;

            pieces.push(enemy({ x: objectX, y: objectY }));
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

        Game.getInstance().objects.set(key, new SetPiece(pieces, 'health'));
    }
}

function tree(position) {
    const random = getRandomValue({
        initialValue: 1,
        randomValue: 6,
        rounded: true,
    });

    const image = getNumberedImage('set_pieces_tree', random);

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
