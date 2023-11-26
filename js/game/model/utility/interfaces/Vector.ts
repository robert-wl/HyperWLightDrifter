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
        return new Vector(0, 0);
    }

    public static parse({ x, y }): Vector {
        return new Vector(x, y);
    }

    public static parseAll(vectors: { x: number; y: number }[]): Vector[] {
        return vectors.map(({ x, y }) => new Vector(x, y));
    }

    public static copy(vector: Vector): Vector {
        return JSON.parse(JSON.stringify(vector));
    }

    public static add(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    public static multiply(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    public static toKey(vector: Vector): string {
        return `${vector.x.toString()},${vector.y.toString()}`;
    }

    public static fromKey(key: string): Vector {
        const [x, y] = key.split(',');
        return new Vector(Number(x), Number(y));
    }

    public multiply(scalar: number): Vector {
        return Vector.multiply(this, scalar);
    }

    public copy(): Vector {
        return Vector.copy(this);
    }

    public add(vector: Vector): Vector {
        return Vector.add(this, vector);
    }
}
