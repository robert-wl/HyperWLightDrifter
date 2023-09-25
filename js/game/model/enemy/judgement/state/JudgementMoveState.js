import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class JudgementMoveState extends JudgementBaseState {
    enterState() {
        super.enterState();
        this.walkAmount = 0;
        this.walkTime = getRandomValue({
            initialValue: 5,
            randomValue: 10,
        });
    }

    drawImage(currJudgement) {
        const judgementMove = getNumberedImage('judgement_move', this.animationStage);

        drawImage({
            img: judgementMove,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            height: judgementMove.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currJudgement.angle) === 'left',
        });
    }

    updateState(currJudgement) {
        super.updateState();

        if (this.checkCounter(15)) {
            this.walkAmount += 1;
        }

        this.advanceAnimationStage(15, 4);

        if (this.walkTime <= this.walkAmount) {
            currJudgement.handleSwitchState();
        }

        const { player, deltaTime } = Game.getInstance();
        const { centerPosition } = player;

        const distance = getMagnitudeValue({
            x: centerPosition.x - currJudgement.position.x,
            y: centerPosition.y - currJudgement.position.y,
        });

        currJudgement.angle = getAngle({
            x: centerPosition.x - currJudgement.position.x,
            y: centerPosition.y - currJudgement.position.y,
        });

        if (Math.abs(distance) < 100) {
            currJudgement.angle += Math.PI / 2;
        }

        currJudgement.position.x += getHorizontalValue({
            magnitude: currJudgement.moveSpeed * deltaTime,
            angle: currJudgement.angle,
        });
        currJudgement.position.y += getVerticalValue({
            magnitude: currJudgement.moveSpeed * deltaTime,
            angle: currJudgement.angle,
        });
    }
}
