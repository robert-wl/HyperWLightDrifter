import PlayerBaseState from './PlayerBaseState.js';
import Game from '../../game/Game.js';
import GameSettings from '../../../constants.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
export default class PlayerAttackTwoState extends PlayerBaseState {
    constructor() {
        super();
        this.direction = '';
    }
    enterState(currPlayer) {
        this.number = 1;
        this.animationStage = 1;
        const angle = currPlayer.lookAngle;
        const pVector = new PolarVector(currPlayer.attackMoveSpeed, angle);
        currPlayer.velocity.x = DistanceHelper.getHorizontalValue(pVector);
        currPlayer.velocity.y = DistanceHelper.getVerticalValue(pVector);
        const direction = DirectionHelper.getMouseDirection(angle);
        this.direction = direction;
        currPlayer.lastDirection = direction;
        currPlayer.getAttackBox({
            direction: this.direction,
        });
        currPlayer.attackObserver.notify('playerAttack');
        currPlayer.clicks.splice(currPlayer.clicks.indexOf('left'), 1);
        AudioManager.playAudio('player/attack.wav', 2);
    }
    exitState(currPlayer) {
        this.direction = '';
        this.animationStage = 1;
    }
    updateState(currPlayer) {
        this.number += Game.deltaTime;
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
        if (Game.debug) {
            this.drawDebug(currPlayer);
        }
        let attackImage = null;
        if (this.direction === 'w') {
            attackImage = AssetManager.getNumberedImage('attack_two_up', this.animationStage);
        }
        if (this.direction === 'a' || this.direction === 'd') {
            attackImage = AssetManager.getNumberedImage('attack_two_side', this.animationStage);
        }
        if (this.direction === 's') {
            attackImage = AssetManager.getNumberedImage('attack_two_down', this.animationStage);
        }
        if (attackImage === null) {
            return;
        }
        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: attackImage.width * GameSettings.GAME.GAME_SCALE,
            h: attackImage.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(attackImage, imageSize, true, this.direction === 'a');
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
                attackOne: true,
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
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
}
