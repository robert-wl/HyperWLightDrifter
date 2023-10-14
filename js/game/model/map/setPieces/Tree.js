import SetPiece from './SetPiece.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import { getRandomValue } from '../../../helper/randomHelper.js';

export default class Tree extends SetPiece {
    constructor(x, y) {
        super(x, y);

        const random = getRandomValue({
            initialValue: 1,
            randomValue: 6,
            rounded: true,
        });

        this.image = getNumberedImage('set_pieces_tree', random);
    }
}
