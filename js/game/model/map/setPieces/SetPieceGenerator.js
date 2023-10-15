import Game from '../../Game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../helper/randomHelper.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import Collider from '../../collideable/Collider.js';
import SetPiece from './SetPiece.js';
import GameSettings from '../../../constants.js';

const directionX = [1, 0, -1, 0, 1, 1, -1, -1];
const directionY = [0, 1, 0, -1, 1, -1, 1, -1];
export default class SetPieceGenerator {
    static generate(position, forceEmpty = false) {
        const { TREE_INITIAL_CHANCE } = GameSettings.GAME.FOREST_STAGE;
        this.treeChance = TREE_INITIAL_CHANCE;

        this.updateChance(position);

        if (getRandomBoolean(this.treeChance) && !forceEmpty) {
            this.generateTree(position);
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
            }
        }
    }

    static generateTree({ x, y }) {
        const { FOREST_STAGE, GAME_SCALE } = GameSettings.GAME;
        const { FLOOR_WIDTH } = FOREST_STAGE;
        const pieces = [];

        for (let i = 0; i < Math.random() * 5; i++) {
            const objectX = x * FLOOR_WIDTH * GAME_SCALE + Math.random() * FLOOR_WIDTH * 3;
            const objectY = y * FLOOR_WIDTH * GAME_SCALE + (Math.random() * FLOOR_WIDTH) / 2;

            if (getRandomBoolean(0.4)) {
                pieces.push(
                    this.largeTree({
                        x: objectX,
                        y: objectY,
                    }),
                );
            }
            pieces.push(this.tree({ x: objectX, y: objectY }));
        }

        Game.getInstance().objects.set(`${y},${x}`, new SetPiece(pieces, 'tree'));
    }

    static tree(position) {
        const random = getRandomValue({
            initialValue: 1,
            randomValue: 6,
            rounded: true,
        });

        const image = getNumberedImage('set_pieces_tree_small', random);

        const collider = new Collider({
            x: position.x + image.width / 2,
            y: position.y - (4 * image.height) / 5,
            width: image.width,
            height: image.height / 2,
        });
        return {
            image: image,
            position: position,
            flipped: getRandomBoolean(0.5),
            collider: collider,
        };
    }

    static largeTree(position) {
        const random = getRandomValue({
            initialValue: 1,
            randomValue: 2,
            rounded: true,
        });

        const image = getNumberedImage('set_pieces_tree_large', random);

        const collider = new Collider({
            x: position.x + (2 * image.width) / 3,
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
}
