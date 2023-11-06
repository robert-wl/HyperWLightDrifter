import Game from '../../model/game/Game.js';

export function getMouseDirection({ angle }) {
    if (angle <= (Math.PI * 5) / 6 && angle > Math.PI / 6) {
        return 's';
    }
    if (angle <= -Math.PI / 6 && angle > (-Math.PI * 5) / 6) {
        return 'w';
    }
    if (angle <= Math.PI / 4 && angle > -Math.PI / 4) {
        return 'd';
    }
    if (angle <= (-Math.PI * 3) / 4 || angle >= (Math.PI * 3) / 4) {
        return 'a';
    }
    return '';
}

export function getMoveDirection({ currPlayer }) {
    const { keys, deltaTime } = Game.getInstance();
    let direction = '';
    if (keys.includes('a') && !keys.includes('d')) {
        if (currPlayer.velocity.x > -currPlayer.maxSpeed * deltaTime) {
            currPlayer.velocity.x += -deltaTime;
        }
        direction = 'a';
    }
    if (keys.includes('w') && !keys.includes('s')) {
        if (currPlayer.velocity.y > -currPlayer.maxSpeed * deltaTime) {
            currPlayer.velocity.y += -deltaTime;
        }
        direction = 'w';
    }
    if (keys.includes('d') && !keys.includes('a')) {
        if (currPlayer.velocity.x < currPlayer.maxSpeed * deltaTime) {
            currPlayer.velocity.x += deltaTime;
        }
        direction = 'd';
    }
    if (keys.includes('s') && !keys.includes('w')) {
        if (currPlayer.velocity.y < currPlayer.maxSpeed * deltaTime) {
            currPlayer.velocity.y += deltaTime;
        }
        direction = 's';
    }

    return { direction, playerDirection: currPlayer.velocity };
}

export function getFaceDirection(angle) {
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        return 'left';
    }
    return 'right';
}
