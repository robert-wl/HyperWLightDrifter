import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../game/Game.js';
import GameSettings from '../../../../constants.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
import Judgement from '../Judgement.js';
import { JudgementDashData } from '../../../utility/interfaces/JudgementDashData';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class JudgementDashState extends JudgementBaseState {
    private flyTime: number;
    private shadowCounter: number;
    private destination: Vector;
    private angle: number;
    private lastData: JudgementDashData[] = [];

    public constructor() {
        super();
        this.flyTime = 0;
        this.shadowCounter = 0;
        this.destination = Vector.Zero();
        this.angle = 0;
    }

    public enterState(currJudgement: Judgement) {
        super.enterState(currJudgement);
        this.flyTime = 10;
        this.shadowCounter = 0;
        this.destination = currJudgement.attackPosition[RandomHelper.randomValue(0, currJudgement.attackPosition.length - 1, true)];
    }

    public drawImage(currJudgement: Judgement) {
        this.lastData.forEach((data, index) => {
            Game.getInstance().setTransparency(1 - (this.lastData.length - index) / this.lastData.length);

            this.judgementDashDrawer(data);
        });

        Game.getInstance().setTransparency(1);

        const judgementMove = AssetManager.getNumberedImage('judgement_move', this.animationStage);

        const imageSize = Box.parse({
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            w: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            h: judgementMove.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementMove, imageSize, true, DirectionHelper.getFaceDirection(currJudgement.angle) === 'left');
    }

    public updateState(currJudgement: Judgement) {
        this.updateNumberCounter();

        this.advanceAnimationStage(15, 3);

        const { player } = Game.getInstance();

        this.shadowCounter += Game.deltaTime;

        currJudgement.angle = AngleHelper.getAngle(
            Vector.parse({
                x: player.centerPosition.x - currJudgement.position.x,
                y: player.centerPosition.y - (currJudgement.position.y + 40),
            }),
        );
        this.angle = AngleHelper.getAngle(
            Vector.parse({
                x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
                y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2),
            }),
        );

        const dist = DistanceHelper.getMagnitude(
            Vector.parse({
                x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
                y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2),
            }),
        );

        if (Math.abs(dist) < 20) {
            currJudgement.handleSwitchState();
        }

        const pVector = new PolarVector(this.flyTime * Game.deltaTime, this.angle);
        currJudgement.position.x += DistanceHelper.getHorizontalValue(pVector);
        currJudgement.position.y += DistanceHelper.getVerticalValue(pVector);

        this.shadowHandler(currJudgement);
    }

    private shadowHandler(currJudgement: Judgement) {
        const data = {
            moveNumber: this.animationStage,
            angle: currJudgement.angle,
            lastPosition: { ...currJudgement.position },
        } as JudgementDashData;

        if (this.shadowCounter >= 5) {
            this.lastData.push(data);
            this.shadowCounter = 0;
        }

        if (this.lastData.length > 3) {
            this.lastData.shift();
        }
    }

    private judgementDashDrawer({ moveNumber, angle, lastPosition }) {
        const judgementMove = AssetManager.getNumberedImage('judgement_move', (moveNumber % 3) + 1);

        if (DirectionHelper.getFaceDirection(angle) === 'left') {
            const imageSize = Box.parse({
                x: lastPosition.x,
                y: lastPosition.y,
                w: judgementMove.width * GameSettings.GAME.GAME_SCALE,
                h: judgementMove.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawImage(judgementMove, imageSize, true, DirectionHelper.getFaceDirection(angle) === 'left');

            return;
        }

        const imageSize = Box.parse({
            x: lastPosition.x,
            y: lastPosition.y,
            w: judgementMove.width * GameSettings.GAME.GAME_SCALE,
            h: judgementMove.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementMove, imageSize, true);
    }
}
