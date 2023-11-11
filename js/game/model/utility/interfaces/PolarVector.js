export class PolarVector {
    constructor(value, angle) {
        this.value = value;
        this.angle = angle;
    }
    static Zero() {
        return new PolarVector(0, 0);
    }
}
