import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';
import { drawMirroredY } from '../../../../helper/renderer/drawer.js';
import judgementDashDrawer from '../../../../helper/boss/judgmenentDashDrawer.js';

export default class JudgementDashState extends JudgementBaseState {
    lastData = [];
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.flyTime = 15;
        this.destination = currJudgement.attackPosition[Math.floor(Math.random() * currJudgement.attackPosition.length)];
    }

    updateState(currJudgement) {
        this.number++;

        if (this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }
        const player = Game.getInstance().player;
        currJudgement.angle = Math.atan2(player.position.y - (currJudgement.position.y + currJudgement.height + 40), player.position.x - (currJudgement.position.x + currJudgement.width / 2));
        this.angle = Math.atan2(this.destination.y - (currJudgement.position.y + currJudgement.height / 2), this.destination.x - (currJudgement.position.x + currJudgement.width / 2));

        const dist = Math.sqrt(Math.pow(this.destination.x - (currJudgement.position.x + currJudgement.width / 2), 2) + Math.pow(this.destination.y - (currJudgement.position.y + currJudgement.height / 2), 2));
        if (Math.abs(dist) < 20) {
            currJudgement.handleSwitchState({
                move: false,
                moveTwo: false,
                attack: true,
                laser: true,
            });
        }

        currJudgement.position.x += Math.cos(this.angle) * this.flyTime;
        currJudgement.position.y += Math.sin(this.angle) * this.flyTime;

        const angle = currJudgement.angle;
        const data = {
            canvas: Game.getInstance().ctx,
            moveNumber: this.animationStage,
            angle: angle,
            lastPosition: { ...currJudgement.position },
        };

        // judgementDashDrawer(data);
        if (this.number % 5 === 0) {
            this.lastData.push(data);
        }
        if (this.lastData.length > 3) {
            this.lastData.shift();
        }
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().ctx;

        for (let i = 0; i < this.lastData.length; i++) {
            ctx.globalAlpha = 1 - (this.lastData.length - i) / this.lastData.length;
            judgementDashDrawer(this.lastData[i]);
        }
        ctx.globalAlpha = 1;

        get_image('boss/move', 'judgement_move', (this.animationStage % 3) + 1, (img) => {
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
