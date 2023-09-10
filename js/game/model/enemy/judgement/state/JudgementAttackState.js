import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';
import { drawMirroredY } from '../../../../helper/renderer/drawer.js';
import JudgementBullet from '../JudgementBullet.js';

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
        // if (Game.getInstance().debug || true) {
        //     const ctx = Game.getInstance().ctx;
        //     ctx.beginPath();
        //     ctx.arc(currJudgement.position.x + currJudgement.width / 2, currJudgement.position.y + currJudgement.height / 2, 100, currJudgement.angle - Math.PI / 3, currJudgement.angle + Math.PI / 3, false);
        //     ctx.lineTo(currJudgement.position.x + currJudgement.width / 2, currJudgement.position.y + currJudgement.height / 2);
        //     ctx.fillStyle = 'pink';
        //     ctx.fill();
        //     ctx.closePath();
        // }

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

            let offset = 60;
            if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
                offset = 35;
            }
            JudgementBullet.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height / 2 + 40,
                angle: this.attackAngle,
            });

            JudgementBullet.generate({
                x: currJudgement.position.x + currJudgement.width / 2 + offset,
                y: currJudgement.position.y + currJudgement.height / 2 + 40,
                angle: this.attackAngle + Math.PI,
            });
        }
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().ctx;
        get_image('boss/attack', 'judgement_attack', this.animationStage, (img) => {
            if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
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
            } else {
                ctx.drawImage(img, currJudgement.position.x, currJudgement.position.y, img.width * 2, img.height * 2);
            }
        });
    }
}
