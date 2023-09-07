import JudgementBaseState from "./JudgementBaseState.js";
import {get_image} from "../../../../helper/fileReader.js";
import Game from "../../../Game.js";
import JudgementLaser from "../JudgementLaser.js";
import {drawMirroredY} from "../../../../helper/renderer/drawer.js";

export default class JudgementLaserState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = Math.round(Math.random() * 3) + 3;
        this.attackCount = 0;
        this.attacking = 10;
        this.attackAngle = currJudgement.angle;
    }

    updateState(currJudgement) {
        this.number++;
        if (this.number === 15) {
            this.number = 0;
            this.animationStage++;

        }

        this.attackAngle = Math.atan2(
            Game.getInstance().player.position.y - (currJudgement.position.y + currJudgement.height / 2),
            Game.getInstance().player.position.x - (currJudgement.position.x + currJudgement.width / 2),
        )



       if(this.attacking !== 10 && this.attacking !== 0) {
           let offset = 60;
           if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
               offset = -20;
           }
            JudgementLaser.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height + 70,
                angle: this.attackAngle + Math.random() * 0.25 - 0.125 + (Math.PI / 2 * 0.05 * (this.number - 5) % 10)
            });
       }

        if(this.animationStage === 8 && this.number === 14) {
            this.attacking--;
        }
        if (this.animationStage === 10 && this.attacking > 0) {
            this.animationStage -= 2;
        }
        if(this.animationStage === 12) {
            currJudgement.switchState(currJudgement.moveState);
        }

    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/laser', 'judgement_laser', (this.animationStage % 11) + 1, (img) => {
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
                })
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
        })
    }
}
