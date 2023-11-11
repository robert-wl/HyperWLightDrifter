import { Vector } from './interfaces/Vector.js';

export default class HitBoxComponent {
    private readonly _xOffset: number;
    private readonly _yOffset: number;
    private readonly _wOffset: number;
    private readonly _hOffset: number;

    public constructor(xOffset: number, yOffset: number, wOffset: number, hOffset: number) {
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._wOffset = wOffset;
        this._hOffset = hOffset;
    }

    get xOffset(): number {
        return this._xOffset;
    }

    get yOffset(): number {
        return this._yOffset;
    }

    get wOffset(): number {
        return this._wOffset;
    }

    get hOffset(): number {
        return this._hOffset;
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
