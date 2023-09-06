import JudgementBaseState from "./JudgementBaseState.js";
import {get_image} from "../../../../helper/fileReader.js";
import Game from "../../../Game.js";


export default class JudgementSpawnState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
    }

    updateState(currJudgement) {
        this.number++;
        if(this.number === 7) {
            this.number = 0;
            this.animationStage++;
        }

        if(this.animationStage === 22) {
           currJudgement.switchState(currJudgement.moveState);
        }
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/spawn', 'judgement_spawn', this.animationStage, (img) => {
            ctx.drawImage(
                img,
                currJudgement.position.x,
                currJudgement.position.y,
                img.width * 2,
                img.height * 2
            );
        });
    }
}
