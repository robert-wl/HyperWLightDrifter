export default class SetPiece {
    private readonly pieces: any[];
    private readonly type: any;

    constructor(pieces, type) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this.pieces = pieces;
        this.type = type;
    }
}
