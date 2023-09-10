

export function randomizeValue({ initialValue = 0, randomValue = 0}) {
    console.log(initialValue)
    return initialValue + Math.random() * randomValue;
}

export function getRandomBoolean(chance = 0) {
    return Math.random() >= (1 - chance);
}
