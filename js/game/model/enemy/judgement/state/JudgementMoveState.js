import JudgementBaseState from "./JudgementBaseState.js";
import {get_image} from "../../../../helper/fileReader.js";
import Game from "../../../Game.js";


export default class JudgementMoveState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
    }

    updateState(currJudgement) {
        this.number++;
        if(this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss', 'judgement_move', (this.animationStage % 3) + 1, (img) => {
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
