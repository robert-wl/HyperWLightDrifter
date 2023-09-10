import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import { get_image } from '../../../../helper/fileReader.js';
import Game from '../../../Game/Game.js';

export default class CrystalSpiderDieState extends CrystalSpiderBaseState {
    enterState(_currSpider) {
        Game.getInstance().enemyCount--;
    }

    drawImage(currSpider) {
        currSpider.position.x += Math.cos(currSpider.angle) * currSpider.speed;
        currSpider.position.y += Math.sin(currSpider.angle) * currSpider.speed;
        currSpider.speed *= 0.9;
        const ctx = Game.getInstance().ctx;
        get_image('enemy/crystal_spider', 'crystal_spider_die', null, (image) => {
            if ((currSpider.angle > 0 && currSpider.angle < Math.PI / 2) || (currSpider.angle < 0 && currSpider.angle > -Math.PI / 2)) {
                ctx.drawImage(image, currSpider.position.x, currSpider.position.y, currSpider.width, currSpider.height);
            } else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currSpider.position.x - currSpider.width, currSpider.position.y, currSpider.width, currSpider.height);
                ctx.scale(-1, 1);
            }
        });
    }
}
