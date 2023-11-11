import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
export default class PlayerHurtState extends PlayerBaseState {
    constructor() {
        super();
        this.mirrored = false;
    }
    enterState(currPlayer) {
        super.enterState(currPlayer);
        this.mirrored = this.mirroredHandler(currPlayer);
        AudioManager.playAudio('player_hurt_audio');
    }
    updateState(currPlayer) {
        super.updateState(currPlayer);
        this.advanceAnimationStage(10);
        if (this.animationStage >= 4) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
    drawImage(currPlayer) {
        const playerHurt = AssetManager.getNumberedImage('player_hurt', this.animationStage);
        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: playerHurt.width * GameSettings.GAME.GAME_SCALE,
            h: playerHurt.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(playerHurt, imageSize, true, this.mirrored);
    }
    mirroredHandler(currPlayer) {
        const { direction } = DirectionHelper.getMoveDirection(currPlayer);
        if (direction === 'w' || direction === 's' || direction === '') {
            return RandomHelper.getRandomBoolean(0.5);
        }
        return direction === 'a';
    }
}
