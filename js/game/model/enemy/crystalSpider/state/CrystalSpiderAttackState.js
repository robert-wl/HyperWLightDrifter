import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import playerCollision from '../../../../helper/collision/playerCollision.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
export default class CrystalSpiderAttackState extends CrystalSpiderBaseState {
    constructor() {
        super();
        this.angle = 0;
        this.attackDrag = 0;
    }
    enterState(currSpider) {
        super.enterState(currSpider);
        this.angle = currSpider.angle;
        this.attackDrag = 0.25;
        currSpider.attackSpeed = 20;
        const { audio } = Game.getInstance();
        audio.playAudio('enemy/crystal_spider/attack.wav');
    }
    updateState(currSpider) {
        super.updateState(currSpider);
        const { deltaTime, movementDeltaTime } = Game.getInstance();
        if (this.checkCounterReversed(10)) {
            currSpider.attackSpeed = 20;
        }
        if (this.checkCounter(20)) {
            currSpider.switchState(currSpider.moveState);
        }
        currSpider.attackSpeed = currSpider.attackSpeed * (1 - this.attackDrag * movementDeltaTime);
        currSpider.position.x += getHorizontalValue({
            magnitude: currSpider.attackSpeed * deltaTime,
            angle: this.angle,
        });
        currSpider.position.y += getVerticalValue({
            magnitude: currSpider.attackSpeed * deltaTime,
            angle: this.angle,
        });
        playerCollision({
            position: {
                x: currSpider.position.x,
                y: currSpider.position.y,
            },
            angle: this.angle,
        });
    }
    drawImage(currSpider) {
        const spiderAttack = getImage('crystal_spider_attack');
        // console.log(spiderAttack);
        drawImage({
            img: spiderAttack,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(this.angle) === 'left',
        });
    }
}
