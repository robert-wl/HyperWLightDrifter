import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import GameSettings from '../../../../constants.js';
export default class CrystalSpiderDieState extends CrystalSpiderBaseState {
    constructor() {
        super();
        this.friction = 0;
    }
    enterState(currSpider) {
        super.enterState(currSpider);
        this.friction = 0.1;
        if (RandomHelper.getRandomBoolean(0.05)) {
            currSpider.enemyObserver.notify('spawnKey', currSpider.position);
        }
        AudioManager.playAudio('crystal_spider_death_audio');
    }
    updateState(currSpider) {
        const { centerPosition } = Game.getInstance().player;
        const distance = DistanceHelper.getManhattanDistance({
            x: currSpider.position.x - centerPosition.x,
            y: currSpider.position.y - centerPosition.y,
        });
        if (distance > 1000) {
            currSpider.enemyObserver.notify('clearEnemy', currSpider);
        }
    }
    drawImage(currSpider) {
        currSpider.speed = currSpider.speed * (1 - this.friction) * Game.movementDeltaTime;
        const pVector = new PolarVector(currSpider.speed, currSpider.angle);
        currSpider.position.x += DistanceHelper.getHorizontalValue(pVector);
        currSpider.position.y += DistanceHelper.getVerticalValue(pVector);
        const spiderDie = AssetManager.getImage('crystal_spider_die');
        const imageSize = Box.parse({
            x: currSpider.position.x,
            y: currSpider.position.y,
            w: spiderDie.width * GameSettings.GAME.GAME_SCALE,
            h: spiderDie.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(spiderDie, imageSize, true, DirectionHelper.getFaceDirection(currSpider.angle) === 'left');
    }
}
