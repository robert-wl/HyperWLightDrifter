export interface PolarVector {
    value: number;
    angle: number;
}

export class PolarVector {
    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }

    public static Zero() {
        return new PolarVector(0, 0);
    }
}
