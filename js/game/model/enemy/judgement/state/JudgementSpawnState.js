import JudgementBaseState from './JudgementBaseState.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';

export default class JudgementSpawnState extends JudgementBaseState {
    enterState() {
        this.number = 0;
        this.animationStage = 1;
    }

    updateState(currJudgement) {
        this.number++;

        if (this.number === 7) {
            this.number = 0;
            this.animationStage++;
        }

        if (this.animationStage === 22) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }

    drawImage(currJudgement) {
        const judgementSpawn = getNumberedImage('judgement_spawn', this.animationStage);

        drawImage({
            img: judgementSpawn,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementSpawn.width * 2,
            height: judgementSpawn.height * 2,
            translate: true,
        });
    }
}
