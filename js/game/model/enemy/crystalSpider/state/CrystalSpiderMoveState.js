import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';
import { getRandomBoolean, getRandomValue } from '../../../../helper/randomHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import {getNumberedImage} from "../../../../helper/imageLoader.js";
import {drawImage} from "../../../../helper/renderer/drawer.js";
import {getFaceDirection} from "../../../../helper/collision/directionHandler.js";

export default class CrystalSpiderMoveState extends CrystalSpiderBaseState {
    enterState(_currSpider) {
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = getRandomBoolean(0.5);
        this.attackCooldown = 100;
    }
    updateState(currSpider) {
        this.number += 1;

        if(this.number % 20 === 0) {
            const { audio } = Game.getInstance();
            audio.playAudio('enemy/crystal_spider/walk.wav');
        }
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
        const { angle } = currSpider;
        const { ctx } = Game.getInstance();

        if (this.number % 4 === 0) {
            this.animationStage = (this.animationStage + 1) % 4;
        }

        const spiderWalk = getNumberedImage('crystal_spider_walk', this.animationStage + 1);

        drawImage({
            img: spiderWalk,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(angle) === 'left',
        })
    }

    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }
}
