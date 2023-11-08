import { Vector } from './enums/Vector.js';

export default class HitBoxComponent {
    private _xOffset: number;
    private _yOffset: number;
    private _wOffset: number;
    private _hOffset: number;

    public constructor(xOffset: number, yOffset: number, wOffset: number, hOffset: number) {
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._wOffset = wOffset;
        this._hOffset = hOffset;
    }

    get xOffset(): number {
        return this._xOffset;
    }

    set xOffset(value: number) {
        this._xOffset = value;
    }

    get yOffset(): number {
        return this._yOffset;
    }

    set yOffset(value: number) {
        this._yOffset = value;
    }

    get wOffset(): number {
        return this._wOffset;
    }

    set wOffset(value: number) {
        this._wOffset = value;
    }

    get hOffset(): number {
        return this._hOffset;
    }

    set hOffset(value: number) {
        this._hOffset = value;
    }

    public getPoints(position: Vector, width: number, height: number) {
        return {
            x: position.x + this._xOffset,
            y: position.y + this._yOffset,
            w: width - this._wOffset,
            h: height - this._hOffset,
        };
    }
}
