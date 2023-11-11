export default class HitBoxComponent {
    constructor(xOffset, yOffset, wOffset, hOffset) {
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._wOffset = wOffset;
        this._hOffset = hOffset;
    }
    get xOffset() {
        return this._xOffset;
    }
    set xOffset(value) {
        this._xOffset = value;
    }
    get yOffset() {
        return this._yOffset;
    }
    set yOffset(value) {
        this._yOffset = value;
    }
    get wOffset() {
        return this._wOffset;
    }
    set wOffset(value) {
        this._wOffset = value;
    }
    get hOffset() {
        return this._hOffset;
    }
    set hOffset(value) {
        this._hOffset = value;
    }
    getPoints(position, width, height) {
        return {
            x: position.x + this._xOffset,
            y: position.y + this._yOffset,
            w: width - this._wOffset,
            h: height - this._hOffset,
        };
    }
}
