import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import getEntityOnAttack from '../../../helper/player/getEntityOnAttack.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';

export default class PlayerAttackTwoState extends PlayerBaseState {
    number = 1;
    animationStage = 1;

    enterState(currPlayer) {
        const angle = currPlayer.lookAngle;

        currPlayer.velocity.x = getHorizontalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: angle,
        });
        currPlayer.velocity.y = getVerticalValue({
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
        this.animationStage = 1;
    }

    updateState(currPlayer) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;

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

        let attackImage = null;

        if (this.direction === 'w') {
            attackImage = getNumberedImage('attack_two_up', this.animationStage);
        }
        if (this.direction === 'a' || this.direction === 'd') {
            attackImage = getNumberedImage('attack_two_side', this.animationStage);
        }
        if (this.direction === 's') {
            attackImage = getNumberedImage('attack_two_down', this.animationStage);
        }

        if (attackImage === null) {
            return;
        }

        drawImage({
            img: attackImage,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: attackImage.width * GameSettings.GAME.GAME_SCALE,
            height: attackImage.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: this.direction === 'a',
        });
    }

    drawDebug(currPlayer) {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'red';
        ctx.fillRect(
            currPlayer.attackBox.x,
            currPlayer.attackBox.y,
            currPlayer.attackBox.w,
            currPlayer.attackBox.h,
        );
    }

    attackSideTiming(currPlayer) {
        this.advanceAnimationStage(1);

        if (this.animationStage >= 20) {
            currPlayer.handleSwitchState({
                move: true,
                attack: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }

    attackVerticalTiming(currPlayer) {
        this.advanceAnimationStage(2);

        if (this.animationStage >= 12) {
            currPlayer.handleSwitchState({
                move: true,
                attack: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
