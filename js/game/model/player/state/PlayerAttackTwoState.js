import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import getEntityOnAttack from '../../../helper/player/getEntityOnAttack.js';
import {getHorizontalValue, getVerticalValue} from "../../../helper/distanceHelper.js";
import { getNumberedImage} from "../../../helper/imageLoader.js";
import GameSettings from "../../../constants.js";

export default class PlayerAttackTwoState extends PlayerBaseState {
    number = 1;
    attackNumber = 1;

    enterState(currPlayer) {
        const angle = currPlayer.lookAngle;
        currPlayer.direction.x = getHorizontalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: angle,
        });
        currPlayer.direction.y = getVerticalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: angle,
        });

        const direction = getMouseDirection({ angle });

        this.direction = direction;
        currPlayer.lastDirection = direction;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        getEntityOnAttack({
            player: currPlayer,
            entity: Game.getInstance().enemyList,
        });

        const { clicks, audio } = Game.getInstance();
        clicks.splice(clicks.indexOf('left'), 1);
        audio.playAudio('player/attack.wav', 2);
    }

    exitState(currPlayer) {
        this.direction = '';
        this.attackNumber = 1;
    }

    updateState(currPlayer) {
        this.number += 1;

        currPlayer.getAttackBox({
            direction: this.direction,
        });

        if (this.direction === 'a' || this.direction === 'd') {
            this.attackSideTiming(currPlayer);
            return;
        }
        if (this.direction === 'w' || this.direction === 's') {
            this.attackVerticalTiming(currPlayer);
        }
    }

    drawImage(currPlayer) {
        if (Game.getInstance().debug) {
            this.drawDebug(currPlayer);
        }

        if (this.direction === 'w') {
            const attack2Up = getNumberedImage('attack2_up', this.attackNumber);

            drawImage({
                img: attack2Up,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attack2Up.width * GameSettings.GAME.GAME_SCALE,
                height: attack2Up.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: !currPlayer.reversed,
            });

            return;
        }
        if (this.direction === 'a' || this.direction === 'd') {
            const attack2Side = getNumberedImage('attack2_side', this.attackNumber);

            drawImage({
                img: attack2Side,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attack2Side.width * GameSettings.GAME.GAME_SCALE,
                height: attack2Side.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: this.direction === 'a',
            });

            return;
        }
        if (this.direction === 's') {
            const attack2Down = getNumberedImage('attack2_down', this.attackNumber);

            drawImage({
                img: attack2Down,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: attack2Down.width * GameSettings.GAME.GAME_SCALE,
                height: attack2Down.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
                mirrored: !currPlayer.reversed,
            });
        }
    }

    drawDebug(currPlayer) {
        const { ctx } = Game.getInstance();
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
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
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
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
