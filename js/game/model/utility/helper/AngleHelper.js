export default class AngleHelper {
    static getAngle(position) {
        return Math.atan2(position.y, position.x);
    }
}
