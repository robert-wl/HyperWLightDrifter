import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import GameSettings from '../../../../constants.js';
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
        AudioManager.playAudio('crystal_spider_attack_audio');
    }
    updateState(currSpider) {
        super.updateState(currSpider);
        if (this.checkCounterReversed(10)) {
            currSpider.attackSpeed = 20;
        }
        if (this.checkCounter(20)) {
            currSpider.switchState(currSpider.moveState);
        }
        currSpider.attackSpeed = currSpider.attackSpeed * (1 - this.attackDrag * Game.movementDeltaTime);
        const pVector = new PolarVector(currSpider.attackSpeed * Game.deltaTime, this.angle);
        currSpider.position.x += DistanceHelper.getHorizontalValue(pVector);
        currSpider.position.y += DistanceHelper.getVerticalValue(pVector);
        currSpider.attackObserver.notify('attack', currSpider);
    }
    drawImage(currSpider) {
        const spiderAttack = AssetManager.getImage('crystal_spider_attack');
        const imageSize = Box.parse({
            x: currSpider.position.x,
            y: currSpider.position.y,
            w: spiderAttack.width * GameSettings.GAME.GAME_SCALE,
            h: spiderAttack.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(spiderAttack, imageSize, true, DirectionHelper.getFaceDirection(currSpider.angle) === 'left');
    }
}
