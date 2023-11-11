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
}
