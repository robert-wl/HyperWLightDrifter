import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';
import { getRandomBoolean, getRandomValue } from '../../../../helper/randomHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';

export default class CrystalSpiderMoveState extends CrystalSpiderBaseState {
    enterState(_currSpider) {
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = getRandomBoolean(0.5);
        this.attackCooldown = getRandomValue({
            initialValue: 0,
            randomValue: 100,
        });
    }
    updateState(currSpider) {
        this.number += 1;

        const { position } = Game.getInstance().player;
        const distance = getMagnitudeValue({
            x: position.x - currSpider.position.x,
            y: position.y - currSpider.position.y,
        });

        if (distance < 100 && this.number > this.attackCooldown) {
            currSpider.switchState(currSpider.attackState);
        } else if (distance < 100) {
            currSpider.angle = getAngle({
                x: position.x - currSpider.position.x,
                y: position.y - currSpider.position.y,
            });

            const rotate_angle = this.getRotateAngle(currSpider.angle);

            currSpider.position.x += getHorizontalValue({
                magnitude: currSpider.speed,
                angle: rotate_angle,
            });

            currSpider.position.y += getVerticalValue({
                magnitude: currSpider.speed,
                angle: rotate_angle,
            });
        } else {
            currSpider.angle = getAngle({
                x: position.x - currSpider.position.x,
                y: position.y - currSpider.position.y,
            });

            currSpider.position.x += getHorizontalValue({
                magnitude: currSpider.speed,
                angle: currSpider.angle,
            });

            currSpider.position.y += getVerticalValue({
                magnitude: currSpider.speed,
                angle: currSpider.angle,
            });
        }
    }
    drawImage(currSpider) {
        const ctx = Game.getInstance().ctx;
        const angle = currSpider.angle;

        if (this.number % 4 === 0) {
            this.animationStage = (this.animationStage + 1) % 4;
        }
        get_image('enemy/crystal_spider', 'crystal_spider_walk', this.animationStage + 1, (image) => {
            if ((angle > 0 && angle < Math.PI / 2) || (angle < 0 && angle > -Math.PI / 2)) {
                ctx.drawImage(image, currSpider.position.x, currSpider.position.y, currSpider.width, currSpider.height);
            } else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currSpider.position.x - currSpider.width, currSpider.position.y, currSpider.width, currSpider.height);
                ctx.scale(-1, 1);
            }
        });
    }

    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }
}
