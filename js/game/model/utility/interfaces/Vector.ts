export interface Vector {
    x: number;
    y: number;
}

export class Vector {
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static Zero(): Vector {
        return { x: 0, y: 0 };
    }

    public static parse(vector: Vector): Vector {
        return { x: vector.x, y: vector.y };
    }

    public static copy(vector: Vector): Vector {
        return JSON.parse(JSON.stringify(vector));
    }

    public static add(vector1: Vector, vector2: Vector): Vector {
        return { x: vector1.x + vector2.x, y: vector1.y + vector2.y };
    }

    public static toKey(vector: Vector): string {
        return `${vector.x.toString()},${vector.y.toString()}`;
    }
}
