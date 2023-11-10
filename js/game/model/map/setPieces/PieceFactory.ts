import Collider from '../../collideable/Collider.js';
import { Piece } from '../../utility/interfaces/Piece.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';

export default class PieceFactory {
    public constructor() {
        //
    }

    public generateTreePiece(position: Vector) {
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
        } as Piece;
    }

    public generatePlantsPiece(position: Vector, type: number) {
        const image = AssetManager.getNumberedImage('set_pieces_plants', type);

        return {
            image: image,
            position: position,
            flipped: RandomHelper.getRandomBoolean(0.5),
            collider: null,
        } as Piece;
    }

    public generateLargeTreePiece(position: Vector) {
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
        } as Piece;
    }

    public generateStonePiece(position: Vector) {
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
        } as Piece;
    }

    public generateLargeStonePiece(position: Vector) {
        const random = RandomHelper.randomValue(1, 4, true);

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
        } as Piece;
    }

    public generateEnemyPiece(position: Vector) {
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
        } as Piece;
    }

    public generateHealthPiece(position: Vector) {
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
        } as Piece;
    }
}
