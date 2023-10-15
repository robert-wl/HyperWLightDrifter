export function getHorizontalValue({ initial = 0, magnitude = 0, angle = 0 }) {
    return initial + Math.cos(angle) * magnitude;
}

export function getVerticalValue({ initial = 0, magnitude = 0, angle = 0 }) {
    return initial + Math.sin(angle) * magnitude;
}

export function getMagnitudeValue({ x = 0, y = 0 }) {
    return Math.sqrt(x * x + y * y);
}

export function getManhattanDistance({ x = 0, y = 0 }) {
    return Math.abs(x) + Math.abs(y);
}
