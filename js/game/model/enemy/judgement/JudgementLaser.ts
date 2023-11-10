import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import HitBoxComponent from '../../utility/HitBoxComponent.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import Observable from '../../utility/Observable.js';
import { Box } from '../../utility/interfaces/Box.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class JudgementLaser extends Enemy {
    private lifetime: number;

    public constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, velocity: PolarVector, lifetime: number, enemyObserver: Observable, attackObserver: Observable) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.velocity = velocity;
        this.lifetime = lifetime;
    }

    public handleDamage() {}

    public knockback() {
        this.velocity.value *= 3;
    }

    public update() {
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

    public kill() {
        this.enemyObserver.notify('clearBossEntity', this);
    }

    public render() {
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
