import JudgementBaseState from './JudgementBaseState.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from "../../../../constants.js";

export default class JudgementSpawnState extends JudgementBaseState {
    enterState() {
        this.number = 0;
        this.animationStage = 1;
    }

    updateState(currJudgement) {
        this.number += 1;

        if (this.number === 7) {
            this.number = 0;
            this.animationStage += 1;
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
}
