import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import judgementDashDrawer from '../../../../helper/boss/judgementDashDrawer.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import GameSettings from '../../../../constants.js';

export default class JudgementDashState extends JudgementBaseState {
    lastData = [];

    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.flyTime = 10;
        this.destination =
            currJudgement.attackPosition[
                getRandomValue({
                    randomValue: currJudgement.attackPosition.length - 1,
                    rounded: true,
                })
                ];
    }

    drawImage(currJudgement) {
        this.lastData.forEach((data, index) => {
            Game.getInstance().setTransparency(1 - (this.lastData.length - index) / this.lastData.length);

            judgementDashDrawer(data);
        });

        Game.getInstance().setTransparency(1);

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
        this.number += 1;

        if (this.number === 15) {
            this.number = 0;
            this.animationStage += 1;

            if (this.animationStage === 4) {
                this.animationStage = 1;
            }
        }

        const { player } = Game.getInstance();

        currJudgement.angle = getAngle({
            x: player.centerPosition.x - currJudgement.position.x,
            y: player.centerPosition.y - (currJudgement.position.y + 40),
        });
        this.angle = getAngle({
            x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
            y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2),
        });

        const dist = getMagnitudeValue({
            x: this.destination.x - (currJudgement.position.x + currJudgement.width / 2),
            y: this.destination.y - (currJudgement.position.y + currJudgement.height / 2),
        });

        if (Math.abs(dist) < 20) {
            currJudgement.handleSwitchState();
        }

        currJudgement.position.x += getHorizontalValue({
            magnitude: this.flyTime,
            angle: this.angle,
        });
        currJudgement.position.y += getVerticalValue({
            magnitude: this.flyTime,
            angle: this.angle,
        });

        this.shadowHandler(currJudgement);
    }

    shadowHandler(currJudgement) {
        const data = {
            moveNumber: this.animationStage,
            angle: currJudgement.angle,
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
