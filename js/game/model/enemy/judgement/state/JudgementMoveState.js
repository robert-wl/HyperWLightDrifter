import JudgementBaseState from "./JudgementBaseState.js";
import {get_image} from "../../../../helper/fileReader.js";
import Game from "../../../Game.js";
import {drawMirroredY} from "../../../../helper/renderer/drawer.js";


export default class JudgementMoveState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.walkTime = Math.random() * 10;
    }

    updateState(currJudgement) {
        this.number++;

        const { position } = Game.getInstance().player;
        const dx = position.x - (currJudgement.position.x + currJudgement.width / 2);
        const dy = position.y - (currJudgement.position.y + currJudgement.height / 2);

        currJudgement.angle = Math.atan2(dy, dx);

        currJudgement.position.x += Math.cos(currJudgement.angle) * currJudgement.moveSpeed;
        currJudgement.position.y += Math.sin(currJudgement.angle) * currJudgement.moveSpeed;

        if(this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }

        if(this.walkTime <= this.animationStage) {
            currJudgement.handleSwitchState({
                move: true,
                dash: true,
                attack: true,
                laser: true,
            });
        }
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/move', 'judgement_move', (this.animationStage % 3) + 1, (img) => {
            if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
                drawMirroredY({
                    canvas: ctx,
                    img: img,
                    position: {
                        x: currJudgement.position.x,
                        y: currJudgement.position.y,
                    },
                    width: img.width * 2,
                    height: img.height * 2,
                });
            }
            else {
                ctx.drawImage(
                    img,
                    currJudgement.position.x,
                    currJudgement.position.y,
                    img.width * 2,
                    img.height * 2
                );
            }
        });
    }
}
