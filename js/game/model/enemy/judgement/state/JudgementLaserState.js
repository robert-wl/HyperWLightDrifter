import JudgementBaseState from "./JudgementBaseState.js";
import {get_image} from "../../../../helper/fileReader.js";
import Game from "../../../Game/Game.js";
import JudgementLaser from "../JudgementLaser.js";
import {drawMirroredY} from "../../../../helper/renderer/drawer.js";

export default class JudgementLaserState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = Math.round(Math.random() * 3) + 1;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
    }

    updateState(currJudgement) {
        this.number++;
        if (this.number % 15 === 0) {
            this.animationStage++;

        }

        if(this.animationStage === 7){
            const player = Game.getInstance().player;
            this.attackAngle = Math.atan2(
                (player.position.y ) - (currJudgement.position.y + currJudgement.height + 40),
                (player.position.x ) - (currJudgement.position.x + currJudgement.width / 2),
            )
            currJudgement.angle = this.attackAngle;
        }



       if(this.attacking !== 5 && this.animationStage < 12) {
           let offset = 75;
           if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
               offset = -40;
           }
            JudgementLaser.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height + 30,
                angle: this.attackAngle + (Math.random() - 0.5) * 0.25 + Math.sin(this.number * 0.05) * 0.5
            });
       }

        if(this.animationStage === 8 && this.number % 14 === 0) {
            this.attacking--;
        }
        if (this.animationStage === 12 && this.attacking > 0) {
            this.animationStage -= 4;
        }
        if(this.animationStage === 13) {
            currJudgement.switchState(currJudgement.moveState);
        }

    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().ctx;
        get_image('boss/laser', 'judgement_laser', (this.animationStage % 13) + 1, (img) => {
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
