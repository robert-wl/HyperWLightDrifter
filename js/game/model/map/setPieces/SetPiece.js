import GameSettings from '../../../constants.js';
import { drawImage } from '../../../helper/renderer/drawer.js';

export default class SetPiece {
    constructor(pieces, type) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this.pieces = pieces;
        this.type = type;
    }

    getPieces() {
        return this.pieces;
    }

    drawPiece(piece) {
        const { image, position, flipped } = piece;

        drawImage({
            img: image,
            x: position.x,
            y: position.y,
            width: image.width * GameSettings.GAME.GAME_SCALE,
            height: image.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: flipped,
        });
    }
}
