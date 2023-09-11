import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import GameSettings from "../../../../constants.js";
import {getRandomValue} from "../../../../helper/randomHelper.js";
import {getFaceDirection} from "../../../../helper/collision/directionHandler.js";

export default class JudgementMoveState extends JudgementBaseState {
    enterState() {
        this.number = 0;
        this.animationStage = 1;
        this.walkTime = getRandomValue({
            randomValue: 10,
        });
    }

    updateState(currJudgement) {
        this.number += 1;

        const { centerPosition } = Game.getInstance().player;

        currJudgement.angle = getAngle({
            x: centerPosition.x - (currJudgement.position.x + currJudgement.width / 2),
            y: centerPosition.y - (currJudgement.position.y + currJudgement.height / 2),
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
            this.animationStage += 1;
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

        if (getFaceDirection(currJudgement.angle) === 'left') {
            drawMirroredY({
                img: judgementMove,
                position: {
                    x: currJudgement.position.x,
                    y: currJudgement.position.y,
                },
                width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
                height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });

            return;
        }

        drawImage({
            img: judgementMove,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
