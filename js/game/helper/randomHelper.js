

export function getRandomValue({ initialValue = 0, randomValue = 0, rounded = false }) {
    const value = initialValue + Math.random() * randomValue;
    if (rounded) {
        return Math.floor(value);
    }
    return value;
}

export function getRandomBoolean(chance = 0) {
    return Math.random() >= (1 - chance);
}
