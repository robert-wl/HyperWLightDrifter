import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import EnemyManager from '../../EnemyManager.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class CrystalSpiderDieState extends CrystalSpiderBaseState {
    enterState() {
        const { audio, enemyManager } = Game.getInstance();

        enemyManager.enemyAliveCount -= 1;
        audio.playAudio('enemy/crystal_spider/death.wav');
    }

    drawImage(currSpider) {
        currSpider.position.x += getHorizontalValue({
            magnitude: currSpider.speed,
            angle: currSpider.angle,
        });

        currSpider.position.y += getVerticalValue({
            magnitude: currSpider.speed,
            angle: currSpider.angle,
        });
        currSpider.speed *= 0.9;

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
