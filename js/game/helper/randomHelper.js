

export function randomizeValue({ initialValue = 0, randomValue = 0}) {
    return initialValue + Math.random() * randomValue;
}

export function getRandomBoolean(chance = 0) {
    return Math.random() >= (1 - chance);
}
