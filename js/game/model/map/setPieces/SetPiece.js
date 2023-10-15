export default class SetPiece {
    constructor(pieces, type) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this.pieces = pieces;
        this.type = type;
    }
}
