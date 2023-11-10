import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import { Box } from '../../utility/interfaces/Box.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
export default class JudgementLaser extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, velocity, lifetime, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.velocity = velocity;
        this.lifetime = lifetime;
    }
    handleDamage() { }
    knockback() {
        this.velocity.value *= 3;
    }
    update() {
        this.lifetime -= Game.deltaTime;
        const pVector = new PolarVector(this.velocity.value * Game.deltaTime, this.velocity.angle);
        this.position.x += DistanceHelper.getHorizontalValue(pVector);
        this.position.y += DistanceHelper.getVerticalValue(pVector);
        const box = new Box(this.position.x, this.position.y, this.width, this.height);
        this.attackObserver.notify('attackArea', box);
        this.render();
        if (this.lifetime <= 0) {
            this.kill();
        }
    }
    kill() {
        this.enemyObserver.notify('clearBossEntity', this);
    }
    render() {
        const laserBullet = AssetManager.getImage('judgement_laser_bullet');
        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: laserBullet.width,
            h: laserBullet.height,
        });
        DrawHelper.drawImage(laserBullet, imageSize, true);
    }
}
