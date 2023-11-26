export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class Box {
    public constructor(x: number, y: number, w: number, h: number) {
        return { x, y, w, h };
    }

    public static parse(box: Box): Box {
        return { x: box.x, y: box.y, w: box.w, h: box.h };
    }

    public static Zero(): Box {
        return { x: 0, y: 0, w: 0, h: 0 };
    }
}

interface Dep {
    name: string;
    pacar?: number;
}
