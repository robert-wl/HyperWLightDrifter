import JudgementBaseState from "./JudgementBaseState.js";
import Game from "../../../Game.js";
import {get_image} from "../../../../helper/fileReader.js";
import {drawMirroredY} from "../../../../helper/renderer/drawer.js";
import JudgementBullet from "../JudgementBullet.js";


export default class JudgementAttackState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = Math.round(Math.random() * 3) + 3;
        this.attackCount = 0;
        this.attacking = false;
        this.attackAngle = Math.PI * Math.random();
        this.accel = 0;
    }

    updateState(currJudgement) {
        this.number++;
        if(this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }

        if(this.attacking && this.number % 2 === 0) {
            this.accel += 0.01;
            this.attackAngle += ((1/15) * Math.PI + Math.random() * (1/15) * Math.PI);

            let offset = 60;
            if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
                offset = 30;
            }
            JudgementBullet.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height / 2 + 60,
                angle: this.attackAngle,
            });

            JudgementBullet.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height / 2 + 60,
                angle: this.attackAngle + Math.PI,
            });
        }

        if(this.animationStage === 5) {
            this.animationStage -= 2;
            this.attackCount++;
            this.attacking = true;
        }


        console.log(this.attackCount, this.maxAttackCount)
        if(this.attackCount === this.maxAttackCount) {
            currJudgement.switchState(currJudgement.moveState);
        }

    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/attack', 'judgement_attack', this.animationStage, (img) => {
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
        });
    }
}
