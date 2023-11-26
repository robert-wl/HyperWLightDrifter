export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static Zero() {
        return new Vector(0, 0);
    }
    static parse({ x, y }) {
        return new Vector(x, y);
    }
    static parseAll(vectors) {
        return vectors.map(({ x, y }) => new Vector(x, y));
    }
    static copy(vector) {
        return JSON.parse(JSON.stringify(vector));
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static multiply(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }
    static toKey(vector) {
        return `${vector.x.toString()},${vector.y.toString()}`;
    }
    static fromKey(key) {
        const [x, y] = key.split(',');
        return new Vector(Number(x), Number(y));
    }
    multiply(scalar) {
        return Vector.multiply(this, scalar);
    }
    copy() {
        return Vector.copy(this);
    }
    add(vector) {
        return Vector.add(this, vector);
    }
}
