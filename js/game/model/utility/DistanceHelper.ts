export default class DistanceHelper {
    public static getHorizontalValue(vector: Vector, initial: number = 0) {
        return Math.cos(vector.angle) * vector.value + initial;
    }

    public static getVerticalValue(vector: Vector, initial: number = 0) {
        return Math.sin(vector.angle) * vector.value + initial;
    }

    public static getMagnitude(position: Position) {
        return Math.sqrt(position.x * position.x + position.y * position.y);
    }

    public static getManhattanDistance(position: Position) {
        return Math.abs(position.x) + Math.abs(position.y);
    }
}
