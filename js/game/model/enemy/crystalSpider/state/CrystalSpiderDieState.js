import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import { getHorizontalValue, getManhattanDistance, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { getRandomBoolean } from '../../../../helper/randomHelper.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
export default class CrystalSpiderDieState extends CrystalSpiderBaseState {
    constructor() {
        super();
        this.friction = 0;
    }
    enterState(currSpider) {
        super.enterState(currSpider);
        this.friction = 0.1;
        const { audio } = Game.getInstance();
        if (getRandomBoolean(0.05)) {
            // Key.generate(currSpider.position);
        }
        audio.playAudio('enemy/crystal_spider/death.wav');
    }
    updateState(currSpider) {
        const { centerPosition } = Game.getInstance().player;
        const distance = getManhattanDistance({
            x: currSpider.position.x - centerPosition.x,
            y: currSpider.position.y - centerPosition.y,
        });
        if (distance > 1000) {
            currSpider.clear();
        }
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
