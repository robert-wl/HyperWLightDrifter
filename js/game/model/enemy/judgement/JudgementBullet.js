import Game from '../../Game/Game.js';
import { get_image } from '../../../helper/fileReader.js';
import Enemy from '../Enemy.js';

export default class JudgementBullet extends Enemy {
    static generate({ x, y, angle }) {
        const newJudgementBullet = new JudgementBullet({
            x,
            y,
            velocity: {
                value: 5 + Math.random() * 1,
                angle: angle,
            },
            lifetime: 200 + Math.random() * 200,
        });
        Game.getInstance().bossEntities.push(newJudgementBullet);
    }
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

    damage({ amount, angle }) {
        super.damage({ amount, angle });
        this.knockback();
    }

    knockback() {
        this.velocity.value *= 3;
    }

    update() {
        this.lifetime--;
        this.position.x += Math.cos(this.velocity.angle) * this.velocity.value;
        this.position.y += Math.sin(this.velocity.angle) * this.velocity.value;
        this.render();

        if (this.lifetime <= 0) {
            this.kill();
        }
    }

    kill() {
        Game.getInstance().bossEntities.splice(Game.getInstance().bossEntities.indexOf(this), 1);
    }

    render() {
        const ctx = Game.getInstance().ctx;
        get_image('boss/attack/bullet', 'judgement_bullet', Math.round((this.lifetime / this.maxLifetime) * 3) + 1, (img) => {
            ctx.drawImage(img, this.position.x, this.position.y, img.width, img.height);
        });
    }
}
