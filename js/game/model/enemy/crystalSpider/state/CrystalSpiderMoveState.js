import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../../helper/randomHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { getNumberedImage } from '../../../../helper/assets/assetGetter.js';
export default class CrystalSpiderMoveState extends CrystalSpiderBaseState {
    constructor() {
        super();
        this.clockwise = false;
        this.moveTime = 0;
        this.attackCooldown = 0;
    }
    enterState(currSpider) {
        super.enterState(currSpider);
        this.clockwise = getRandomBoolean(0.5);
        this.moveTime = 0;
        this.attackCooldown = getRandomValue({
            initialValue: 50,
            randomValue: 100,
        });
    }
    updateState(currSpider) {
        super.updateState(currSpider);
        const { deltaTime } = Game.getInstance();
        this.moveTime += deltaTime;
        if (Math.round(this.moveTime) % 20 === 0) {
            const { audio } = Game.getInstance();
            audio.playAudio('enemy/crystal_spider/walk.wav');
        }
        this.advanceAnimationStage(4, 4);
        this.handleMovement(currSpider);
    }
    drawImage(currSpider) {
        const spiderWalk = getNumberedImage('crystal_spider_walk', this.animationStage);
        drawImage({
            img: spiderWalk,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(currSpider.angle) === 'left',
        });
    }
    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }
    handleMovement(currSpider) {
        const { player, deltaTime } = Game.getInstance();
        const { centerPosition } = player;
        const speed = currSpider.speed * deltaTime;
        const distance = getMagnitudeValue({
            x: centerPosition.x - currSpider.position.x,
            y: centerPosition.y - currSpider.position.y,
        });
        if (distance > 500) {
            currSpider.switchState(currSpider.idleState);
            return;
        }
        if (distance < 100 && this.moveTime > this.attackCooldown) {
            currSpider.switchState(currSpider.attackState);
            return;
        }
        let angle = getAngle({
            x: centerPosition.x - currSpider.position.x,
            y: centerPosition.y - currSpider.position.y,
        });
        currSpider.angle = angle;
        if (distance < 100) {
            angle = this.getRotateAngle(currSpider.angle);
        }
        currSpider.position.x += getHorizontalValue({
            magnitude: speed,
            angle: angle,
        });
        currSpider.position.y += getVerticalValue({
            magnitude: speed,
            angle: angle,
        });
    }
}
