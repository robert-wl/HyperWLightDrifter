import Collider from '../../collideable/Collider.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
export default class PieceFactory {
    constructor() {
        //
    }
    generateTreePiece(position) {
        const random = RandomHelper.randomValue(1, 6, true);
        const image = AssetManager.getNumberedImage('set_pieces_tree', random);
        const collider = new Collider({
            x: position.x + image.width / 2,
            y: position.y - (4 * image.height) / 6,
            width: image.width,
            height: image.height / 3,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
    generatePlantsPiece(position, type) {
        const image = AssetManager.getNumberedImage('set_pieces_plants', type);
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: null,
        };
    }
    generateLargeTreePiece(position) {
        const random = RandomHelper.randomValue(1, 2, true);
        const image = AssetManager.getNumberedImage('set_pieces_tree', 6 + random);
        const collider = new Collider({
            x: position.x + (4 * image.width) / 5,
            y: position.y - (3 * image.height) / 5,
            width: image.width / 2,
            height: image.height / 4,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
    generateStonePiece(position) {
        const random = RandomHelper.randomValue(1, 5, true);
        const image = AssetManager.getNumberedImage('set_pieces_stone_small', random);
        const collider = new Collider({
            x: position.x + image.width / 2,
            y: position.y - (4 * image.height) / 6,
            width: image.width,
            height: image.height / 3,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
    generateLargeStonePiece(position) {
        const random = RandomHelper.randomValue(1, 3, true);
        const image = AssetManager.getNumberedImage('set_pieces_stone_big', random);
        const collider = new Collider({
            x: position.x + image.width / 2,
            y: position.y - (4 * image.height) / 6,
            width: image.width,
            height: image.height / 3,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
    generateEnemyPiece(position) {
        const random = RandomHelper.randomValue(1, 7, true);
        const image = AssetManager.getNumberedImage('set_pieces_enemy', random);
        const collider = new Collider({
            x: position.x + (4 * image.width) / 5,
            y: position.y - (3 * image.height) / 5,
            width: image.width / 2,
            height: image.height / 4,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
    generateHealthPiece(position) {
        const random = RandomHelper.randomValue(1, 5, true);
        const image = AssetManager.getNumberedImage('set_pieces_health', random);
        const collider = new Collider({
            x: position.x + (4 * image.width) / 5,
            y: position.y - (3 * image.height) / 5,
            width: image.width / 2,
            height: image.height / 4,
        });
        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: collider,
        };
    }
}
