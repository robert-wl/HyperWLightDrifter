

export function getRandomValue({ initialValue = 0, randomValue = 0, rounded = false }) {
    if (rounded) {
        return Math.round(initialValue + Math.random() * randomValue);
    }
    return initialValue + Math.random() * randomValue;
}

export function getRandomBoolean(chance = 0) {
    return Math.random() >= (1 - chance);
}
