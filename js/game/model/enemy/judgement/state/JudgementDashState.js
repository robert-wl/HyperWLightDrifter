import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import {drawImage, drawMirroredY} from '../../../../helper/renderer/drawer.js';
import judgementDashDrawer from '../../../../helper/boss/judgmenentDashDrawer.js';
import {getAngle} from "../../../../helper/angleHelper.js";
import {getMagnitudeValue} from "../../../../helper/distanceHelper.js";
import {getNumberedImage} from "../../../../helper/imageLoader.js";

export default class JudgementDashState extends JudgementBaseState {
    lastData = [];
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.flyTime = 10;
        this.destination = currJudgement.attackPosition[Math.floor(Math.random() * currJudgement.attackPosition.length)];
    }

    updateState(currJudgement) {
        this.number++;

        if (this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }
        const { player } = Game.getInstance();

        currJudgement.angle = getAngle({
            x: player.position.x - (currJudgement.position.x),
            y: player.position.y - (currJudgement.position.y + 40),
        });
        this.angle = getAngle({
            x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
            y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2)
        });

        const dist = getMagnitudeValue({
            x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
            y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2)
        });

        if (Math.abs(dist) < 20) {
            currJudgement.handleSwitchState({
                move: false,
                moveTwo: false,
                attack: true,
                laser: true,
                bomb: true,
            });
        }

        currJudgement.position.x += Math.cos(this.angle) * this.flyTime;
        currJudgement.position.y += Math.sin(this.angle) * this.flyTime;
        this.shadowHandler(currJudgement);
    }

    drawImage(currJudgement) {
        const ctx = Game.getInstance().ctx;

        for (let i = 0; i < this.lastData.length; i++) {
            ctx.globalAlpha = 1 - (this.lastData.length - i) / this.lastData.length;
            judgementDashDrawer(this.lastData[i]);
        }
        ctx.globalAlpha = 1;

        const judgementMove = getNumberedImage('judgement_move', (this.animationStage % 3) + 1);

        if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
            drawMirroredY({
                canvas: ctx,
                img: judgementMove,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementMove.width * 2,
                height: judgementMove.height * 2,
                translate: true,
            });
        } else {
            drawImage({
                img: judgementMove,
                x: currJudgement.position.x,
                y: currJudgement.position.y,
                width: judgementMove.width * 2,
                height: judgementMove.height * 2,
                translate: true,
            });
        }
    }

    shadowHandler(currJudgement) {
        const { angle } = currJudgement;
        const data = {
            canvas: Game.getInstance().ctx,
            moveNumber: this.animationStage,
            angle: angle,
            lastPosition: { ...currJudgement.position },
        };

        if (this.number % 5 === 0) {
            this.lastData.push(data);
        }
        if (this.lastData.length > 3) {
            this.lastData.shift();
        }
    }
}
