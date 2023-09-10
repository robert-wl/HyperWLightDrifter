import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';

export default class JudgementMoveState extends JudgementBaseState {
    enterState() {
        this.number = 0;
        this.animationStage = 1;
        this.walkTime = Math.random() * 10;
    }

    updateState(currJudgement) {
        this.number++;

        const { position } = Game.getInstance().player;

        currJudgement.angle = getAngle({
            x: position.x - (currJudgement.position.x + currJudgement.width / 2),
            y: position.y - (currJudgement.position.y + currJudgement.height / 2),
        });


        currJudgement.position.x += getHorizontalValue({
            magnitude: currJudgement.moveSpeed,
            angle: currJudgement.angle,
        });
        currJudgement.position.y += getVerticalValue({
            magnitude: currJudgement.moveSpeed,
            angle: currJudgement.angle,
        });

        if (this.number === 15) {
            this.number = 0;
            this.animationStage++;
        }

        if (this.walkTime <= this.animationStage) {
            currJudgement.handleSwitchState({
                move: true,
                dash: true,
                attack: true,
                laser: true,
                bomb: true,
            });
        }
    }

    drawImage(currJudgement) {
        const judgementMove = getNumberedImage('judgement_move', (this.animationStage % 3) + 1);

        if (currJudgement.angle > Math.PI / 2 || currJudgement.angle < -Math.PI / 2) {
            drawMirroredY({
                img: judgementMove,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementMove.width * 2,
                height: judgementMove.height * 2,
                translate: true,
            });

            return;
        }

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
