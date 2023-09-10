import JudgementBaseState from "./JudgementBaseState.js";
import Game from "../../../Game/Game.js";
import JudgementLaser from "../JudgementLaser.js";
import {drawImage, drawMirroredY} from "../../../../helper/renderer/drawer.js";
import {getNumberedImage} from "../../../../helper/imageLoader.js";
import {randomizeValue} from "../../../../helper/randomHelper.js";

export default class JudgementLaserState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = Math.round( randomizeValue({
            randomValue: 1,
        })) + 1;
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
            const { player } = Game.getInstance();
            this.attackAngle = Math.atan2(
                (player.centerPosition.y ) - (currJudgement.position.y + 40),
                (player.centerPosition.x ) - (currJudgement.position.x),
            )
            currJudgement.angle = this.attackAngle;
        }



       if(this.attacking !== 5 && this.animationStage < 12) {
           let offset = 20;
           if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
               offset = -90;
           }
            JudgementLaser.generate({
                x: currJudgement.position.x + offset,
                y: currJudgement.position.y + 30,
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
        const judgementLaser = getNumberedImage('judgement_laser', (this.animationStage % 13) + 1);

        if(currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
            drawMirroredY({
                img: judgementLaser,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementLaser.width * 2,
                height: judgementLaser.height * 2,
                translate: true,
            })
        }
        else {
            drawImage({
                img: judgementLaser,
                x: currJudgement.position.x,
                y: currJudgement.position.y,
                width: judgementLaser.width * 2,
                height: judgementLaser.height * 2,
                translate: true,
            })
        }
    }
}
