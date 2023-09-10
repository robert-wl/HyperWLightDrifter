import CrystalSpiderBaseState from './CrystalSpiderBaseState.js';
import Game from '../../../Game/Game.js';
import { get_image } from '../../../../helper/fileReader.js';

export default class CrystalSpiderMoveState extends CrystalSpiderBaseState {
    clockwise = true;
    enterState(_currSpider) {
        this.number = 0;
        this.animationStage = 0;
        this.clockwise = Math.random() < 0.5;
    }
    updateState(currSpider) {
        this.number += 1;

        const distance = Math.sqrt(
            Math.pow(Game.getInstance().player.position.x - currSpider.position.x, 2) +
            Math.pow(Game.getInstance().player.position.y - currSpider.position.y, 2)
        );

        const x = Game.getInstance().player.position.x - currSpider.position.x;
        const y = Game.getInstance().player.position.y - currSpider.position.y;

        if (currSpider.health <= 0) {
            currSpider.switchState(currSpider.dieState);
            return;
        }

        if (distance < 100 && this.number > 50 + Math.random() * 50) {
            currSpider.switchState(currSpider.attackState);
        } else if (distance < 100) {
            currSpider.angle = Math.atan2(y, x);
            const angle2 = currSpider.angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
            currSpider.position.x += Math.cos(angle2) * currSpider.speed;
            currSpider.position.y += Math.sin(angle2) * currSpider.speed;
        } else {
            currSpider.angle = Math.atan2(y, x);
            currSpider.position.x += Math.cos(currSpider.angle) * currSpider.speed;
            currSpider.position.y += Math.sin(currSpider.angle) * currSpider.speed;
        }
    }
    drawImage(currSpider) {
        const ctx = Game.getInstance().ctx;
        const angle = currSpider.angle;

        if (this.number % 4 === 0) {
            this.animationStage = (this.animationStage + 1) % 4;
        }
        get_image('enemy/crystal_spider', 'crystal_spider_walk', this.animationStage + 1, (image) => {
            if ((angle > 0 && angle < Math.PI / 2) || (angle < 0 && angle > -Math.PI / 2)) {
                ctx.drawImage(image, currSpider.position.x, currSpider.position.y, currSpider.width, currSpider.height);
            } else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -currSpider.position.x - currSpider.width, currSpider.position.y, currSpider.width, currSpider.height);
                ctx.scale(-1, 1);
            }
        });
    }
}
