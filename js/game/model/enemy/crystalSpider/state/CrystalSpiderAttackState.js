import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import playerCollision from '../../../../helper/collision/playerCollision.js';
import {getImage} from "../../../../helper/imageLoader.js";
import {drawImage} from "../../../../helper/renderer/drawer.js";
import {getFaceDirection} from "../../../../helper/collision/directionHandler.js";
import {getHorizontalValue, getVerticalValue} from "../../../../helper/distanceHelper.js";

export default class CrystalSpiderAttackState extends CrystalSpiderBaseState {
    enterState(currSpider) {
        currSpider.attackSpeed = 0;
        this.number = 0;
        this.angle = currSpider.angle;

        const { audio } = Game.getInstance();
        audio.playAudio('enemy/crystal_spider/attack.wav');
    }
    updateState(currSpider) {
        this.number += 1;

        if (this.number <= 10) {
            currSpider.attackSpeed = 20;
        }
        if (this.number === 20) {
            currSpider.switchState(currSpider.moveState);
        }
        currSpider.attackSpeed *= 0.75;

        playerCollision({
            position: {
                x: currSpider.position.x,
                y: currSpider.position.y,
            },
            angle: this.angle,
        });

        currSpider.position.x += getHorizontalValue({
            magnitude: currSpider.attackSpeed,
            angle: this.angle,
        });

        currSpider.position.y += getVerticalValue({
            magnitude: currSpider.attackSpeed,
            angle: this.angle,
        });
    }
    drawImage(currSpider) {
        const spiderAttack = getImage('crystal_spider_attack');

        drawImage({
            img: spiderAttack,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(this.angle) === 'left'
        })

    }
}
