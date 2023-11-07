import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../game/Game.js';
import { getMagnitudeValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import CrystalSpider from '../CrystalSpider';

export default class CrystalSpiderIdleState extends CrystalSpiderBaseState {
    updateState(currSpider: CrystalSpider) {
        const { player } = Game.getInstance();

        const distance = getMagnitudeValue({
            x: player.centerPosition.x - currSpider.position.x,
            y: player.centerPosition.y - currSpider.position.y,
        });

        if (distance < 250) {
            currSpider.switchState(currSpider.moveState);
        }
    }

    drawImage(currSpider: CrystalSpider) {
        const spiderIdle = getImage('crystal_spider_idle');

        drawImage({
            img: spiderIdle,
            x: currSpider.position.x,
            y: currSpider.position.y,
            width: currSpider.width,
            height: currSpider.height,
            translate: true,
            mirrored: getFaceDirection(currSpider.angle) === 'left',
        });
    }
}
