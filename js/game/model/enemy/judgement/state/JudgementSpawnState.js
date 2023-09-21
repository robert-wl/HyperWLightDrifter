import JudgementBaseState from './JudgementBaseState.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from "../../../../constants.js";
import Game from "../../../Game/Game.js";
import AudioPlayer from "../../../../../audio/AudioPlayer.js";

export default class JudgementSpawnState extends JudgementBaseState {
    firstSpawn = true;
    enterState() {
        this.number = 0;
        this.animationStage = 1;

        AudioPlayer.getInstance().playAudio('boss/spawn.wav');
    }

    updateState(currJudgement) {
        const { camera } = Game.getInstance();
        this.number += 1;

        if (this.number === 7) {
            this.number = 0;
            this.animationStage += 1;
        }

        if(this.firstSpawn) {
            camera.moveCameraPosition({
                direction: {
                    y: -(camera.position.y - 100) * 0.05,
                }
            });

        }


        if(this.number === 0 && this.animationStage === 16) {
            camera.setShakeCamera({
                duration: 200,
                angle: Math.PI / 2
            });
        }

        if(this.animationStage === 14) {
            AudioPlayer.getInstance().playAudio('boss/smash_ground.wav');
        }

        if (this.animationStage === 22) {
            currJudgement.handleSwitchState({
                move: true,
                dash: true,
                attack: true,
                laser: true,
            });
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
    exitState() {
        if(this.firstSpawn) {
            const { camera } = Game.getInstance();
            camera.setSnapBackToPlayer();
            AudioPlayer.getInstance().playAudio('boss/music.wav', null, true);
        }
        this.firstSpawn = false;
    }
}
