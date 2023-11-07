import { getRandomBoolean, getRandomValue } from '../../../helper/randomHelper.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';
import Collider from '../../collideable/Collider.js';
import { Piece } from '../../utility/enums/Piece.js';

export default class PieceFactory {
    public constructor() {
        //
    }

    public generateTreePiece(position: Position) {
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
        } as Piece;
    }

    public generatePlantsPiece(position: Position, type: number) {
        const image = getNumberedImage('set_pieces_plants', type);

        return {
            image: image,
            position: position,
            flipped: getRandomBoolean(0.5),
            collider: null,
        } as Piece;
    }

    public generateLargeTreePiece(position: Position) {
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
        } as Piece;
    }

    public generateStonePiece(position: Position) {
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
        } as Piece;
    }

    public generateLargeStonePiece(position: Position) {
        const random = getRandomValue({
            initialValue: 1,
            randomValue: 4,
            rounded: true,
        });

        const image = getNumberedImage('set_pieces_stone_big', random);

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
        } as Piece;
    }

    public generateEnemyPiece(position: Position) {
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
        } as Piece;
    }

    public generateHealthPiece(position: Position) {
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
        } as Piece;
    }
}
