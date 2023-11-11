export default class RandomHelper {
    static randomValue(initialValue = 0, randomValue = 0, rounded = false) {
        const value = initialValue + Math.random() * randomValue;
        if (rounded) {
            return Math.floor(value);
        }
        return value;
    }
    static getRandomBoolean(chance = 0) {
        return Math.random() >= 1 - chance;
    }
}
