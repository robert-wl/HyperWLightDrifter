import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import GameSettings from '../../../../constants.js';
import { Vector } from '../../../utility/interfaces/Vector.js';
export default class CrystalSpiderMoveState extends CrystalSpiderBaseState {
    constructor() {
        super();
        this.clockwise = false;
        this.moveTime = 0;
        this.attackCooldown = 0;
    }
    enterState(currSpider) {
        super.enterState(currSpider);
        this.clockwise = RandomHelper.getRandomBoolean(0.5);
        this.moveTime = 0;
        this.attackCooldown = RandomHelper.randomValue(50, 100);
    }
    updateState(currSpider) {
        super.updateState(currSpider);
        this.moveTime += Game.deltaTime;
        if (Math.round(this.moveTime) % 20 === 0) {
            AudioManager.playAudio('crystal_spider_walk_audio').then();
        }
        this.advanceAnimationStage(4, 4);
        this.handleMovement(currSpider);
    }
    drawImage(currSpider) {
        const spiderWalk = AssetManager.getNumberedImage('crystal_spider_walk', this.animationStage);
        const imageSize = Box.parse({
            x: currSpider.position.x,
            y: currSpider.position.y,
            w: spiderWalk.width * GameSettings.GAME.GAME_SCALE,
            h: spiderWalk.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(spiderWalk, imageSize, true, DirectionHelper.getFaceDirection(currSpider.angle) === 'left');
    }
    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }
    handleMovement(currSpider) {
        const { player } = Game.getInstance();
        const { centerPosition } = player;
        const speed = currSpider.speed * Game.deltaTime;
        const distance = DistanceHelper.getMagnitude(Vector.parse({
            x: centerPosition.x - currSpider.position.x,
            y: centerPosition.y - currSpider.position.y,
        }));
        if (distance > 500) {
            currSpider.switchState(currSpider.idleState);
            return;
        }
        if (distance < 100 && this.moveTime > this.attackCooldown) {
            currSpider.switchState(currSpider.attackState);
            return;
        }
        let angle = AngleHelper.getAngle(Vector.parse({
            x: centerPosition.x - currSpider.position.x,
            y: centerPosition.y - currSpider.position.y,
        }));
        currSpider.angle = angle;
        if (distance < 100) {
            angle = this.getRotateAngle(currSpider.angle);
        }
        const pVector = new PolarVector(speed, angle);
        currSpider.position.x += DistanceHelper.getHorizontalValue(pVector);
        currSpider.position.y += DistanceHelper.getVerticalValue(pVector);
    }
}
