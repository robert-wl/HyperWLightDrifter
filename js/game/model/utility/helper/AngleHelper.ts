import { Vector } from '../interfaces/Vector.js';

export default class AngleHelper {
    public static getAngle(position: Vector) {
        return Math.atan2(position.y, position.x);
    }
}
