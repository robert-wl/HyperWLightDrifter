import JudgementBaseState from './JudgementBaseState.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import Game from '../../../game/Game.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';
import { getNumberedImage } from '../../../../helper/assets/assetGetter.js';

export default class JudgementDeathState extends JudgementBaseState {
    updateState(_currJudgement) {
        super.updateState();

        this.advanceAnimationStage(5);

        const { deltaTime, currState, endState, backgroundOpacity } = Game.getInstance();
        if (this.animationStage >= 21) {
            this.deadTime += deltaTime;

            this.animationStage = 21;
        }

        if (this.deadTime >= 0 && !this.playedAudio) {
            AudioPlayer.getInstance().playAudio('boss/death.wav');

            this.playedAudio = true;
        }

        if (this.deadTime > 100) {
            Game.getInstance().darkenBackground(0.005 * deltaTime);
        }

        if (backgroundOpacity <= 0.01 && currState !== endState) {
            Game.getInstance().switchState(endState);
        }
    }

    drawImage(currJudgement) {
        const judgementDeath = getNumberedImage('judgement_death', this.animationStage);

        drawImage({
            img: judgementDeath,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementDeath.width * GameSettings.GAME.GAME_SCALE,
            height: judgementDeath.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: this.mirrored,
        });
    }

    enterState(currJudgement) {
        super.enterState(currJudgement);
        this.playedAudio = false;
        this.mirrored = getFaceDirection(currJudgement.angle) === 'left';
        this.deadTime = 0;

        // const { camera, player } = game.getInstance();
        // const x = currJudgement.position.x - player.centerPosition.x;
        // const y = currJudgement.position.y - player.centerPosition.y;
    }
}
