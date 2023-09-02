import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/directionHandler.js';
import playerDashDrawer from '../../../helper/renderer/playerDashDrawer.js';
import Game from '../../Game.js';

export default class PlayerDashState extends PlayerBaseState {
    number = 1;
    dashNumber = 1;
    lastData = [];

    enterState(currPlayer) {
        this.angle = currPlayer.lookAngle;

        const direction = getMouseDirection({ angle: this.angle });
        this.direction = direction;
        currPlayer.lastDirection = direction;

        this.lastPosition = { ...currPlayer.position };

        Game.getInstance().keys.splice(Game.getInstance().keys.indexOf('space'), 1);
    }
    updateState(currPlayer) {
        this.number++;

        if (this.dashNumber < 4) {
            currPlayer.direction.x = Math.cos(this.angle) * currPlayer.dashMoveSpeed;
            currPlayer.direction.y = Math.sin(this.angle) * currPlayer.dashMoveSpeed;
        }

        if (this.direction === 'w') {
            this.dashUpTiming(currPlayer);
            return;
        }
        if (this.direction === 'a' || this.direction === 'd') {
            this.dashSideTiming(currPlayer);
            return;
        }
        if (this.direction === 's') {
            this.dashDownTiming(currPlayer);
        }
    }
    drawImage(currPlayer) {
        if (this.lastData.length > 0) {
            for (const loopData of this.lastData) {
                loopData.filter = 'brightness(50%) hue-rotate(200deg)';
                playerDashDrawer(loopData);
                currPlayer.canvas.filter = 'none';
            }
        }
        const data = {
            canvas: currPlayer.canvas,
            currPosition: {
                x: currPlayer.position.x,
                y: currPlayer.position.y,
            },
            dashNumber: this.dashNumber,
            angle: this.angle,
            lastPosition: this.lastPosition,
            direction: this.direction,
        };
        playerDashDrawer(data);
        if (this.lastData.length > 2) {
            this.lastData.shift();
        }
        if (this.dashNumber % 2 === 0 && this.number < 7) {
            this.lastData.push(data);
        }
    }
    exitState(_currPlayer) {
        this.number = 1;
        this.dashNumber = 1;
        this.lastData = [];
    }

    dashUpTiming(currPlayer) {
        if (this.number === 5 && this.dashNumber <= 3) {
            this.number = 0;
            this.dashNumber += 1;
            return;
        }
        if (this.number === 2 && this.dashNumber > 3 && this.dashNumber < 6) {
            this.number = 0;
            this.dashNumber += 1;
            return;
        }
        if (this.number === 3 && this.dashNumber > 5 && this.dashNumber < 7) {
            this.number = 0;
            this.dashNumber += 1;
        }
        if (this.dashNumber === 7) {
            if (this.lastData.length > 0) {
                this.lastData.shift();
                return;
            }
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
            });
        }
    }

    dashSideTiming(currPlayer) {
        if (this.number === 5 && this.dashNumber < 3) {
            this.number = 0;
            this.dashNumber += 1;
            return;
        }
        if (this.number === 3 && this.dashNumber >= 3 && this.dashNumber < 5) {
            this.number = 0;
            this.dashNumber += 1;
        }
        if (this.dashNumber === 5) {
            if (this.lastData.length > 0) {
                this.lastData.shift();
                return;
            }
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
            });
        }
    }

    dashDownTiming(currPlayer) {
        if (this.number === 5 && this.dashNumber < 3) {
            this.number = 0;
            this.dashNumber += 1;
            return;
        }
        if (this.number === 3 && this.dashNumber >= 3 && this.dashNumber < 6) {
            this.number = 0;
            this.dashNumber += 1;
        }
        if (this.dashNumber === 6) {
            if (this.lastData.length > 0) {
                this.lastData.shift();
                return;
            }
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
            });
        }
    }
}
