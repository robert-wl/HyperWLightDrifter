import Game from '../../Game/Game.js';
import Enemy from '../Enemy.js';
import { getRandomValue } from '../../../helper/randomHelper.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import playerCollision from '../../../helper/collision/playerCollision.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';

export default class JudgementBullet extends Enemy {
    constructor({ x, y, velocity, lifetime }) {
        super({
            x,
            y,
            hitbox: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
            },
            w: 20,
            h: 20,
            health: 1,
            maxHealth: 1,
        });
        this.velocity = velocity;
        this.maxLifetime = lifetime;
        this.lifetime = lifetime;
    }

    static generate({ x, y, angle }) {
        const newJudgementBullet = new JudgementBullet({
            x,
            y,
            velocity: {
                value: getRandomValue({
                    initialValue: 5,
                    randomValue: 1,
                }),
                angle: angle,
            },
            lifetime: getRandomValue({
                initialValue: 100,
                randomValue: 200,
            }),
        });

        const { bossEntities } = Game.getInstance().enemyManager;
        bossEntities.push(newJudgementBullet);
    }

    damage({ amount, angle }) {
        super.damage({ amount, angle });
        this.knockback();
    }

    knockback() {
        this.velocity.value *= 3;
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.lifetime -= deltaTime;

        this.position.x += getHorizontalValue({
            angle: this.velocity.angle,
            magnitude: this.velocity.value * deltaTime,
        });
        this.position.y += getVerticalValue({
            angle: this.velocity.angle,
            magnitude: this.velocity.value * deltaTime,
        });

        playerCollision({
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            angle: this.velocity.angle,
        });

        this.render();

        if (this.lifetime <= 1) {
            this.kill();
        }
    }

    kill() {
        const { bossEntities } = Game.getInstance().enemyManager;
        bossEntities.splice(bossEntities.indexOf(this), 1);
    }

    render() {
        const judgementBullet = getNumberedImage('judgement_bullet', this.getAnimationNumber());

        if (!judgementBullet) {
            return;
        }
        drawImage({
            img: judgementBullet,
            x: this.position.x,
            y: this.position.y,
            width: judgementBullet.width,
            height: judgementBullet.height,
            translate: true,
        });
    }

    getAnimationNumber() {
        return Math.min(Math.floor((this.lifetime / this.maxLifetime) * 4) + 1, 4);
    }
}
