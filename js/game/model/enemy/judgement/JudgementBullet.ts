import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import HitBoxComponent from '../../utility/HitBoxComponent.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import Observable from '../../utility/Observable.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class JudgementBullet extends Enemy {
    private lifetime: number;
    private readonly maxLifetime: number;

    constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, velocity: PolarVector, lifetime: number, enemyObserver: Observable, attackObserver: Observable) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.velocity = velocity;
        this.maxLifetime = lifetime;
        this.lifetime = lifetime;
    }

    public handleDamage({ amount, angle }) {
        super.handleDamage({ amount, angle });
        this.knockback();
    }

    public knockback() {
        this.velocity.value *= 3;
    }

    public update() {
        this.lifetime -= Game.deltaTime;

        const pVector = new PolarVector(this.velocity.value * Game.deltaTime, this.velocity.angle);
        this.position.x += DistanceHelper.getHorizontalValue(pVector);
        this.position.y += DistanceHelper.getVerticalValue(pVector);

        this.attackObserver.notify('attack', this);

        this.render();

        if (this.lifetime <= 0) {
            this.kill();
        }
    }

    private kill() {
        this.enemyObserver.notify('clearBossEntity', this);
    }

    private render() {
        const judgementBullet = AssetManager.getNumberedImage('judgement_bullet', this.getAnimationNumber());

        if (!judgementBullet) {
            return;
        }

        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: judgementBullet.width,
            h: judgementBullet.height,
        });

        DrawHelper.drawImage(judgementBullet, imageSize, true);
    }

    private getAnimationNumber() {
        return Math.min(Math.floor((this.lifetime / this.maxLifetime) * 4) + 1, 4);
    }
}
