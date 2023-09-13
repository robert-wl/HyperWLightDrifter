import Game from "../../model/Game/Game.js";

export function getMouseDirection({ angle }) {
    if (angle <= (Math.PI * 5) / 6 && angle > (Math.PI) / 6) {
        return 's';
    }
    if (angle <= (-Math.PI) / 6 && angle > (-Math.PI * 5) / 6) {
        return 'w';
    }
    if (angle <= (Math.PI) / 4 && angle > (-Math.PI) / 4) {
        return 'd';
    }
    if (angle <= (-Math.PI * 3) / 4 || angle >= (Math.PI * 3) / 4) {
        return 'a';
    }
    return '';
}

export function getMoveDirection({ currPlayer }) {
    const { keys } = Game.getInstance();
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

export function getFaceDirection(angle) {
    if(angle > Math.PI / 2 || angle < -Math.PI / 2){
        return "left";
    }
    return "right";
}
