import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../game/Game.js';
import GameSettings from '../../../../constants.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
export default class JudgementMoveState extends JudgementBaseState {
    constructor() {
        super();
        this.walkAmount = 0;
        this.walkTime = 0;
    }
    enterState(currJudgement) {
        super.enterState(currJudgement);
        this.walkAmount = 0;
        this.walkTime = RandomHelper.randomValue(5, 10);
    }
    drawImage(currJudgement) {
        const judgementMove = AssetManager.getNumberedImage('judgement_move', this.animationStage);
        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            h: judgementMove.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementMove, imageSize, true, DirectionHelper.getFaceDirection(currJudgement.angle) === 'left');
    }
    updateState(currJudgement) {
        super.updateState(currJudgement);
        if (this.checkCounter(15)) {
            this.walkAmount += 1;
        }
        this.advanceAnimationStage(15, 4);
        if (this.walkTime <= this.walkAmount) {
            currJudgement.handleSwitchState();
        }
        const { player } = Game.getInstance();
        const { centerPosition } = player;
        const distance = DistanceHelper.getMagnitude(Vector.parse({
            x: centerPosition.x - currJudgement.position.x,
            y: centerPosition.y - currJudgement.position.y,
        }));
        currJudgement.angle = AngleHelper.getAngle(Vector.parse({
            x: centerPosition.x - currJudgement.position.x,
            y: centerPosition.y - currJudgement.position.y,
        }));
        if (Math.abs(distance) < 100) {
            currJudgement.angle += Math.PI / 2;
        }
        const pVector = new PolarVector(currJudgement.moveSpeed * Game.deltaTime, currJudgement.angle);
        currJudgement.position.x += DistanceHelper.getHorizontalValue(pVector);
        currJudgement.position.y += DistanceHelper.getVerticalValue(pVector);
    }
}
