import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import getEntityOnAttack from '../../../helper/player/getEntityOnAttack.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';
import GameSettings from '../../../constants.js';

export default class PlayerAttackState extends PlayerBaseState {
    number = 1;
    animationStage = 1;

    updateState(currPlayer) {
        super.updateState(currPlayer);
        const { clicks } = Game.getInstance();

        currPlayer.getAttackBox({
            direction: this.direction,
        });

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

        let attackImage = null;

        if (this.direction === 'w') {
            attackImage = getNumberedImage('attack_up', this.animationStage);
        }
        if (this.direction === 'a' || this.direction === 'd') {
            attackImage = getNumberedImage('attack_side', this.animationStage);
        }
        if (this.direction === 's') {
            attackImage = getNumberedImage('attack_down', this.animationStage);
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

    enterState(currPlayer) {
        const { lookAngle } = currPlayer;

        currPlayer.velocity.x = getHorizontalValue({
            magnitude: currPlayer.attackMoveSpeed,
            angle: lookAngle,
        });
        currPlayer.velocity.y = getVerticalValue({
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

        const { clicks, audio } = Game.getInstance();
        clicks.splice(clicks.indexOf('left'), 1);
        audio.playAudio('player/attack.wav', 1);
    }

    exitState(currPlayer) {
        this.direction = '';
        this.animationStage = 1;
        currPlayer.reversed = !currPlayer.reversed;
        currPlayer.combo = false;
    }

    drawDebug(currPlayer) {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'red';
        ctx.fillRect(currPlayer.attackBox.x, currPlayer.attackBox.y, currPlayer.attackBox.w, currPlayer.attackBox.h);
    }

    attackSideTiming(currPlayer) {
        this.advanceAnimationStage(1);

        if (this.animationStage >= 20) {
            currPlayer.handleSwitchState({
                move: true,
                attackTwo: true,
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
                attackTwo: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
