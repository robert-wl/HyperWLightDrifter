import { Vector } from './enums/Vector.js';

export default class DistanceHelper {
    public static getHorizontalValue(vector: PolarVector, initial: number = 0) {
        return Math.cos(vector.angle) * vector.value + initial;
    }

    public static getVerticalValue(vector: PolarVector, initial: number = 0) {
        return Math.sin(vector.angle) * vector.value + initial;
    }

    public static getMagnitude(position: Vector) {
        return Math.sqrt(position.x * position.x + position.y * position.y);
    }

    public static getManhattanDistance(position: Vector) {
        return Math.abs(position.x) + Math.abs(position.y);
    }
}
