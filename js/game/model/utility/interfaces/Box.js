export class Box {
    constructor(x, y, w, h) {
        return { x, y, w, h };
    }
    static parse(box) {
        return { x: box.x, y: box.y, w: box.w, h: box.h };
    }
    static Zero() {
        return { x: 0, y: 0, w: 0, h: 0 };
    }
}
