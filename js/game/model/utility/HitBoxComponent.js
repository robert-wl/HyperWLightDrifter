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
    get yOffset() {
        return this._yOffset;
    }
    get wOffset() {
        return this._wOffset;
    }
    get hOffset() {
        return this._hOffset;
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
