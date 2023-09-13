import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import getEntityOnAttack from '../../../helper/player/getEntityOnAttack.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';

const scale = 2;

export default class PlayerAttackState extends PlayerBaseState {
    reversed = false;
    number = 1;
    attackNumber = 1;

    enterState(currPlayer) {
        const { lookAngle } = currPlayer;

        currPlayer.direction.x = getHorizontalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: lookAngle,
        });
        currPlayer.direction.y = getVerticalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: lookAngle,
        });

        const direction = getMouseDirection({
            angle: lookAngle,
        });

        this.direction = direction;
        currPlayer.lastDirection = direction;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        getEntityOnAttack({
            player: currPlayer,
        });

        const { clicks } = Game.getInstance();
        clicks.splice(clicks.indexOf('left'), 1);
    }

    exitState(currPlayer) {
        this.direction = '';
        this.attackNumber = 1;
        currPlayer.reversed = !currPlayer.reversed;
        currPlayer.combo = false;
    }

    updateState(currPlayer) {
        this.number += 1;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        const { clicks } = Game.getInstance();
        if (clicks.includes('left')) {
            currPlayer.combo = true;
        }

        if (this.direction === 'a' || this.direction === 'd') {
            this.attackSideTiming(currPlayer);
            return;
        }
        if (this.direction === 'w' || this.direction === 's') {
            this.attackVerticalTiming(currPlayer);
        }
    }

    drawImage(currPlayer) {
        const { debug } = Game.getInstance();

        if (debug) {
            this.drawDebug(currPlayer);
        }

        if (this.direction === 'w') {
            const attackUp = getNumberedImage('attack_up', this.attackNumber);

            drawImage({
                img: attackUp,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attackUp.width * GameSettings.GAME.GAME_SCALE,
                height: attackUp.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: currPlayer.reversed,
            });

            return;
        }
        if (this.direction === 'a' || this.direction === 'd') {
            const attackSide = getNumberedImage('attack_side', this.attackNumber);

            drawImage({
                img: attackSide,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attackSide.width * GameSettings.GAME.GAME_SCALE,
                height: attackSide.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: this.direction === 'a',
            });

            return;
        }
        if (this.direction === 's') {
            const attackDown = getNumberedImage('attack_down', this.attackNumber);

            drawImage({
                img: attackDown,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attackDown.width * GameSettings.GAME.GAME_SCALE,
                height: attackDown.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: currPlayer.reversed,
            });
        }
    }

    drawDebug(currPlayer) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            currPlayer.attackBox.x,
            currPlayer.attackBox.y,
            currPlayer.attackBox.w,
            currPlayer.attackBox.h
        );
    }

    attackSideTiming(currPlayer) {
        if (this.number === 4 && this.attackNumber === 1) {
            this.number = 0;
            this.attackNumber += 1;
            return;
        }
        if (this.number === 2 && this.attackNumber < 4) {
            this.number = 0;
            this.attackNumber += 1;
            return;
        }
        if (this.number === 4 && this.attackNumber < 8) {
            this.number = 0;
            this.attackNumber += 1;
        }
        if (this.attackNumber === 8) {
            if (currPlayer.combo) {
                currPlayer.switchState(currPlayer.attackTwoState);
                return;
            }
            if (Game.getInstance().keys.length > 0) {
                currPlayer.switchState(currPlayer.moveState);
                return;
            }
            currPlayer.switchState(currPlayer.idleState);
        }
    }

    attackVerticalTiming(currPlayer) {
        if (this.number === 2 && this.attackNumber < 2) {
            this.number = 0;
            this.attackNumber += 1;
            return;
        }
        if (this.number === 4 && this.attackNumber < 7) {
            this.number = 0;
            this.attackNumber += 1;
        }
        if (this.attackNumber === 7) {
            currPlayer.handleSwitchState({
                move: true,
                attackTwo: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
