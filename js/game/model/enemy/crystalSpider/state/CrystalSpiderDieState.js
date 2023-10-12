import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class CrystalSpiderDieState extends CrystalSpiderBaseState {
    enterState(currSpider) {
        super.enterState(currSpider);
        this.friction = 0.1;

        const { audio, enemyManager } = Game.getInstance();

        enemyManager.enemyAliveCount -= 1;
        audio.playAudio('enemy/crystal_spider/death.wav');
    }

    drawImage(currSpider) {
        const { deltaTime, movementDeltaTime } = Game.getInstance();

        currSpider.speed = currSpider.speed * (1 - this.friction) * movementDeltaTime;

        currSpider.position.x += getHorizontalValue({
            magnitude: currSpider.speed * deltaTime,
            angle: currSpider.angle,
        });

        currSpider.position.y += getVerticalValue({
            magnitude: currSpider.speed * deltaTime,
            angle: currSpider.angle,
        });

        const spiderDie = getImage('crystal_spider_die');

        drawImage({
            img: spiderDie,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(currSpider.angle) === 'left',
        });
    }
}
