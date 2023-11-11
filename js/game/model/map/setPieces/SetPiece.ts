import { CombinedPiece } from '../../utility/interfaces/Piece';

export default class SetPiece {
    private readonly _pieces: CombinedPiece[];
    private _type: any;

    constructor(pieces: CombinedPiece[], type: string) {
        pieces = pieces.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });
        this._pieces = pieces;
        this._type = type;
    }

    get pieces(): CombinedPiece[] {
        return this._pieces;
    }

    get type(): any {
        return this._type;
    }

    set type(value: any) {
        this._type = value;
    }
}
