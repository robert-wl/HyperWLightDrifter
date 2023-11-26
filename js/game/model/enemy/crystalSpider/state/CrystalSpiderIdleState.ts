import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import CrystalSpider from '../CrystalSpider.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import GameSettings from '../../../../constants.js';
import { Vector } from '../../../utility/interfaces/Vector.js';

export default class CrystalSpiderIdleState extends CrystalSpiderBaseState {
    updateState(currSpider: CrystalSpider) {
        const { player } = Game.getInstance();

        const distance = DistanceHelper.getMagnitude(
            Vector.parse({
                x: player.centerPosition.x - currSpider.position.x,
                y: player.centerPosition.y - currSpider.position.y,
            }),
        );

        if (distance < 250) {
            currSpider.switchState(currSpider.moveState);
        }
    }

    drawImage(currSpider: CrystalSpider) {
        const spiderIdle = AssetManager.getImage('crystal_spider_idle');

        const imageSize = Box.parse({
            x: currSpider.position.x,
            y: currSpider.position.y,
            w: spiderIdle.width * GameSettings.GAME.GAME_SCALE,
            h: spiderIdle.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(spiderIdle, imageSize, true, DirectionHelper.getFaceDirection(currSpider.angle) === 'left');
    }
}
