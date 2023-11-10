import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
export default class PlayerMoveState extends PlayerBaseState {
    constructor() {
        super();
        this.direction = '';
    }
    enterState(currPlayer) { }
    updateState(currPlayer) {
        super.updateState(currPlayer);
        this.advanceAnimationStage(4, 12);
        if (this.animationStage % 6 === 0) {
            const randomValue = RandomHelper.randomValue(1, 2, true);
            AudioManager.playAudio('player/footstep_forest.wav', randomValue);
        }
        currPlayer.regenerateStamina();
        const { direction, playerDirection } = DirectionHelper.getMoveDirection(currPlayer);
        this.direction = direction;
        currPlayer.velocity = playerDirection;
        if (direction) {
            currPlayer.lastDirection = direction;
        }
        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }
    drawImage(currPlayer) {
        let moveImage = null;
        if (this.direction === 'w') {
            moveImage = AssetManager.getNumberedImage('move_up', this.animationStage);
        }
        if (this.direction === 'a') {
            moveImage = AssetManager.getNumberedImage('move_left', this.animationStage);
        }
        if (this.direction === 's') {
            moveImage = AssetManager.getNumberedImage('move_down', this.animationStage);
        }
        if (this.direction === 'd') {
            moveImage = AssetManager.getNumberedImage('move_right', this.animationStage);
        }
        if (moveImage === null) {
            moveImage = this.getIdleImages(currPlayer);
        }
        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: moveImage.width * GameSettings.GAME.GAME_SCALE,
            h: moveImage.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(moveImage, imageSize, true);
    }
    getIdleImages(currPlayer) {
        let idleImage = null;
        if (currPlayer.lastDirection === 'd') {
            idleImage = AssetManager.getImage('idle_right');
        }
        if (currPlayer.lastDirection === 'a') {
            idleImage = AssetManager.getImage('idle_left');
        }
        if (currPlayer.lastDirection === 's') {
            idleImage = AssetManager.getImage('idle_down');
        }
        if (currPlayer.lastDirection === 'w') {
            idleImage = AssetManager.getImage('idle_up');
        }
        return idleImage;
    }
}
