import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';
import {drawImage, drawMirroredY} from '../../../../helper/renderer/drawer.js';
import JudgementBullet from '../JudgementBullet.js';
import {getNumberedImage} from "../../../../helper/imageLoader.js";

export default class JudgementAttackState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = null || Math.round(Math.random() * 3) + 3;
        this.attackCount = 0;
        this.attacking = false;
        this.attackAngle = Math.PI * Math.random();
    }

    updateState(currJudgement) {
        this.number++;
        if (this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }

        this.attack(currJudgement);

        if (this.animationStage === 7) {
            this.animationStage -= 3;
            this.attackCount++;
        }

        if (this.animationStage === 4) {
            this.attacking = true;
        }

        if (this.attackCount === this.maxAttackCount) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }

    attack(currJudgement) {
        if (this.attacking && this.number % 2 === 0) {
            this.attackAngle += (2 / 30) * Math.PI + Math.random() * (1 / 45) * Math.PI;

            let offset = 0;
            if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
                offset = -25;
            }

            JudgementBullet.generate({
                x: currJudgement.position.x + offset,
                y: currJudgement.position.y - 45,
                angle: this.attackAngle,
            });

            JudgementBullet.generate({
                x: currJudgement.position.x + offset,
                y: currJudgement.position.y - 45,
                angle: this.attackAngle + Math.PI,
            });
        }
    }

    drawImage(currJudgement) {
        const judgementAttack = getNumberedImage('judgement_attack', this.animationStage);

        if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
            drawMirroredY({
                img: judgementAttack,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementAttack.width * 2,
                height: judgementAttack.height * 2,
                translate: true,
            });
        }
        else {
            drawImage({
                img: judgementAttack,
                x: currJudgement.position.x,
                y: currJudgement.position.y,
                width: judgementAttack.width * 2,
                height: judgementAttack.height * 2,
                translate: true,
            })
        }

    }
}
