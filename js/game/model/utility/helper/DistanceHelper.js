export default class DistanceHelper {
    constructor() {
        //
    }
    static getHorizontalValue(vector, initial = 0) {
        return Math.cos(vector.angle) * vector.value + initial;
    }
    static getVerticalValue(vector, initial = 0) {
        return Math.sin(vector.angle) * vector.value + initial;
    }
    static getMagnitude(position) {
        return Math.sqrt(position.x * position.x + position.y * position.y);
    }
    static getManhattanDistance(position) {
        return Math.abs(position.x) + Math.abs(position.y);
    }
}
