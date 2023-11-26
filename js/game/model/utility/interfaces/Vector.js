export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static Zero() {
        return { x: 0, y: 0 };
    }
    static parse(vector) {
        return { x: vector.x, y: vector.y };
    }
    static copy(vector) {
        return JSON.parse(JSON.stringify(vector));
    }
    static add(vector1, vector2) {
        return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
    }
    static toKey(vector) {
        return `${vector.x.toString()},${vector.y.toString()}`;
    }
}
