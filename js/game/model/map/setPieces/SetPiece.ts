import { CombinedPiece } from '../../utility/interfaces/Piece.js';
import { SetpieceType } from '../../utility/enums/SetpieceType.js';

export default class SetPiece {
    private readonly _pieces: CombinedPiece[];
    private _type: SetpieceType;

    constructor(pieces: CombinedPiece[], type: SetpieceType) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this._pieces = pieces;
        this._type = type;
    }

    get pieces(): CombinedPiece[] {
        return this._pieces;
    }

    get type(): SetpieceType {
        return this._type;
    }

    set type(value: SetpieceType) {
        this._type = value;
    }
}
