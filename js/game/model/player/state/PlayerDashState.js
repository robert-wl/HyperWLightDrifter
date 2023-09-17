import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import playerDashDrawer from '../../../helper/renderer/playerDashDrawer.js';
import Game from '../../Game/Game.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';

export default class PlayerDashState extends PlayerBaseState {
    number = 1;
    dashNumber = 1;
    lastData = [];

    enterState(currPlayer) {
        this.angle = currPlayer.lookAngle;

        const direction = getMouseDirection({ angle: this.angle });
        this.direction = direction;
        currPlayer.lastDirection = direction;

        currPlayer.stamina -= 10;
        this.lastPosition = { ...currPlayer.position };

        const { audio } = Game.getInstance();
        audio.playAudio('player/dash.wav');
    }
    updateState(currPlayer) {
        this.number += 1;

        this.handleTiming(currPlayer);
        if (this.dashNumber >= 4) {
            return;
        }

        currPlayer.direction.x = getHorizontalValue({
            magnitude: currPlayer.dashMoveSpeed,
            angle: this.angle,
        });
        currPlayer.direction.y = getVerticalValue({
            magnitude: currPlayer.dashMoveSpeed,
            angle: this.angle,
        });
    }
    drawImage(currPlayer) {
        this.lastData.forEach((data) => {
            Game.getInstance().setFilter('brightness(50%) hue-rotate(200deg)');
            playerDashDrawer(data);
            Game.getInstance().setFilter('none');
        });

        const data = this.generateDashData(currPlayer);
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

    generateDashData(currPlayer) {
        return {
            currPosition: {
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
            },
            dashNumber: this.dashNumber,
            angle: this.angle,
            lastPosition: this.lastPosition,
            direction: this.direction,
        };
    }
    handleTiming(currPlayer) {
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
                throws: true,
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
                throws: true,
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
                throws: true,
            });
        }
    }
}
