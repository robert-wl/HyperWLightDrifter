import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import { get_image } from '../../../../helper/fileReader.js';
import Game from '../../../Game/Game.js';
import playerCollision from '../../../../helper/collision/playerCollision.js';

export default class CrystalSpiderAttackState extends CrystalSpiderBaseState {
    angle = 0;
    number = 0;
    enterState(currSpider) {
        currSpider.attackSpeed = 0;
        this.number = 0;
        this.angle = currSpider.angle;
    }
    updateState(currSpider) {
        this.number++;

        if (currSpider.health <= 0) {
            currSpider.switchState(currSpider.dieState);
            return;
        }
        if (this.number <= 10) {
            currSpider.attackSpeed = 20;
        }
        if (this.number === 20) {
            currSpider.switchState(currSpider.moveState);
        }
        currSpider.attackSpeed *= 0.75;

        playerCollision({
            position: {
                x: currSpider.position.x + currSpider.width / 2,
                y: currSpider.position.y + currSpider.height / 2,
            },
            angle: this.angle,
        });

        currSpider.position.x += Math.cos(this.angle) * currSpider.attackSpeed;
        currSpider.position.y += Math.sin(this.angle) * currSpider.attackSpeed;
    }
    drawImage(currSpider) {
        const ctx = Game.getInstance().ctx;

        get_image('enemy/crystal_spider', 'crystal_spider_attack', null, (image) => {
            if ((this.angle > 0 && this.angle < Math.PI / 2) || (this.angle < 0 && this.angle > -Math.PI / 2)) {
                ctx.drawImage(image, currSpider.position.x, currSpider.position.y, currSpider.width, currSpider.height);
            } else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currSpider.position.x - currSpider.width, currSpider.position.y, currSpider.width, currSpider.height);
                ctx.scale(-1, 1);
            }
        });
    }
}
