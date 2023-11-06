import JudgementBaseState from './JudgementBaseState.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';
import { getNumberedImage } from '../../../../helper/assets/assetGetter.js';

export default class JudgementSpawnState extends JudgementBaseState {
    firstSpawn = true;

    updateState(currJudgement) {
        super.updateState();
        const { camera } = Game.getInstance();

        this.advanceAnimationStage(7);

        if (this.checkCounter(6) && this.animationStage === 16) {
            camera.setShakeCamera({
                duration: 200,
                angle: Math.PI / 2,
            });
        }

        if (this.animationStage === 14 && !this.playedSmash) {
            AudioPlayer.getInstance().playAudio('boss/smash_ground.wav');
            this.playedSmash = true;
        }

        if (this.animationStage === 22) {
            currJudgement.handleSwitchState();
        }
    }

    drawImage(currJudgement) {
        const judgementSpawn = getNumberedImage('judgement_spawn', this.animationStage);

        drawImage({
            img: judgementSpawn,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementSpawn.width * GameSettings.GAME.GAME_SCALE,
            height: judgementSpawn.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }

    enterState() {
        super.enterState();
        this.playedSmash = false;

        AudioPlayer.getInstance().playAudio('boss/spawn.wav');
    }

    exitState() {
        if (this.firstSpawn) {
            AudioPlayer.getInstance().playAudio('boss/music.wav', null, true);
        }

        this.firstSpawn = false;
    }
}
