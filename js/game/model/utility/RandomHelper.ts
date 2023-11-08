export default class RandomHelper {
    private constructor() {
        //
    }

    public static getRandomValue(initialValue = 0, randomValue = 0, rounded = false) {
        const value = initialValue + Math.random() * randomValue;
        if (rounded) {
            return Math.floor(value);
        }
        return value;
    }

    public static getRandomBoolean(chance = 0) {
        return Math.random() >= 1 - chance;
    }
}
