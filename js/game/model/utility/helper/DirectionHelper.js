import Game from '../../game/Game.js';
export default class DirectionHelper {
    constructor() {
        //
    }
    static getMouseDirection(angle) {
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
    static getMoveDirection(currPlayer) {
        let direction = '';
        if (currPlayer.keys.includes('a') && !currPlayer.keys.includes('d')) {
            if (currPlayer.velocity.x > -currPlayer.maxSpeed * Game.deltaTime) {
                currPlayer.velocity.x += -Game.deltaTime;
            }
            direction = 'a';
        }
        if (currPlayer.keys.includes('w') && !currPlayer.keys.includes('s')) {
            if (currPlayer.velocity.y > -currPlayer.maxSpeed * Game.deltaTime) {
                currPlayer.velocity.y += -Game.deltaTime;
            }
            direction = 'w';
        }
        if (currPlayer.keys.includes('d') && !currPlayer.keys.includes('a')) {
            if (currPlayer.velocity.x < currPlayer.maxSpeed * Game.deltaTime) {
                currPlayer.velocity.x += Game.deltaTime;
            }
            direction = 'd';
        }
        if (currPlayer.keys.includes('s') && !currPlayer.keys.includes('w')) {
            if (currPlayer.velocity.y < currPlayer.maxSpeed * Game.deltaTime) {
                currPlayer.velocity.y += Game.deltaTime;
            }
            direction = 's';
        }
        return { direction, playerDirection: currPlayer.velocity };
    }
    static getFaceDirection(angle) {
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            return 'left';
        }
        return 'right';
    }
}
