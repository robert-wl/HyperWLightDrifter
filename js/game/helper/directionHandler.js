
export function getMouseDirection({ angle }) {
    if (angle <= (Math.PI) / 4 && angle > (-Math.PI) / 4) {
        return 'd';
    }
    if (angle <= (Math.PI * 3) / 4 && angle > (Math.PI) / 4) {
        return 's';
    }
    if (angle <= (-Math.PI) / 4 && angle > (-Math.PI * 3) / 4) {
        return 'w';
    }
    if (angle <= (-Math.PI * 3) / 4 || angle >= (Math.PI * 3) / 4) {
        return 'a';
    }
    return '';
}

export function getMoveDirection({ keys, currPlayer }) {
    let direction = '';
    if (keys.includes('a')) {
        if (currPlayer.direction.x > -currPlayer.maxSpeed) {
            currPlayer.direction.x += -1;
        }
        direction = 'a';
    }
    if (keys.includes('w')) {
        if (currPlayer.direction.y > -currPlayer.maxSpeed) {
            currPlayer.direction.y += -1;
        }
        direction = 'w';
    }
    if (keys.includes('d')) {
        if (currPlayer.direction.x < currPlayer.maxSpeed) {
            currPlayer.direction.x += 1;
        }
        direction = 'd';
    }
    if (keys.includes('s')) {
        if (currPlayer.direction.y < currPlayer.maxSpeed) {
            currPlayer.direction.y += 1;
        }
        direction = 's';
    }

    return { direction, playerDirection: currPlayer.direction };
}
