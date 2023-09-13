import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../Game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../../helper/randomHelper.js';
import {getHorizontalValue, getMagnitudeValue, getVerticalValue} from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage, drawMirroredY } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class CrystalBruteMoveState extends CrystalBruteBaseState {
    clockwise = true;
    enterState(currBrute) {
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = getRandomBoolean(0.5);
        currBrute.speed = 0.5;
        this.attackDelay = getRandomValue({
            initialValue: 200,
            randomValue: 200,
        });
    }
    updateState(currBrute) {
        this.number += 1;

        if (this.number % 20 === 0) {
            this.animationStage = (this.animationStage + 1) % 6;
        }

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }

        if (this.number > this.attackDelay) {
            currBrute.switchState(currBrute.attackState);
            return;
        }

        this.handleMovement(currBrute);
    }

    handleMovement(currBrute) {
        const { centerPosition } = Game.getInstance().player;

        const distance = getMagnitudeValue({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        if(distance < 200) {
            const rotate_angle = this.getRotateAngle(currBrute.angle);

            currBrute.position.x += getHorizontalValue({
                magnitude: currBrute.speed,
                angle: rotate_angle,
            });

            currBrute.position.y += getVerticalValue({
                magnitude: currBrute.speed,
                angle: rotate_angle,
            });

            return;
        }

        currBrute.angle = getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });
        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });
        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });
    }

    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);

    }
    drawImage(currBrute) {
        const bruteWalk = getNumberedImage('crystal_brute_walk', this.animationStage + 1);

        drawImage({
            img: bruteWalk,
            x: currBrute.position.x,
            y: currBrute.position.y,
            width: currBrute.width,
            height: currBrute.height,
            translate: true,
            mirrored: getFaceDirection(currBrute.angle) === 'left',
        });
    }
}
