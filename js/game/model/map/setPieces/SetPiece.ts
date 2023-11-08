import { CombinedPiece } from '../../utility/enums/Piece';

export default class SetPiece {
    private _pieces: CombinedPiece[];
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

    set pieces(value: CombinedPiece[]) {
        this._pieces = value;
    }

    get type(): any {
        return this._type;
    }

    set type(value: any) {
        this._type = value;
    }
}
