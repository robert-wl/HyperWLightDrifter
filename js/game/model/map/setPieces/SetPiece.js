export default class SetPiece {
    constructor(pieces, type) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this._pieces = pieces;
        this._type = type;
    }
    get pieces() {
        return this._pieces;
    }
    set pieces(value) {
        this._pieces = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
}
