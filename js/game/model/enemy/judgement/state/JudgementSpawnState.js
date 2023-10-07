import JudgementBaseState from './JudgementBaseState.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../Game/Game.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';

export default class JudgementSpawnState extends JudgementBaseState {
    firstSpawn = true;

    updateState(currJudgement) {
        super.updateState();
        const { camera, deltaTime } = Game.getInstance();


        this.advanceAnimationStage(7);

        if (this.firstSpawn) {
            camera.moveCameraPosition({
                direction: {
                    y: -(camera.position.y - 100) * 0.05 * deltaTime,
                },
            });
        }

        if (this.checkCounter(6) && this.animationStage === 16) {
            camera.setShakeCamera({
                duration: 200,
                angle: Math.PI / 2,
            });
        }

        console.log(this.animationStage, this.playedSmash);
        if (this.animationStage === 14 && !this.playedSmash) {
            console.log('henlo');
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
            const { camera } = Game.getInstance();

            camera.setSnapBackToPlayer();

            AudioPlayer.getInstance().playAudio('boss/music.wav', null, true);
        }

        this.firstSpawn = false;
    }
}
