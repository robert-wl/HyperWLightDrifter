import Game from '../../Game.js';
import { get_image } from '../../../helper/fileReader.js';

export default class JudgementBullet {
    static generate({ x, y, angle }) {
        const newJudgementBullet = new JudgementBullet({
            x,
            y,
            velocity: {
                value: 3 + Math.random() * 2,
                angle: angle,
            },
            lifetime: 300,
        });
        Game.getInstance().enemyList.push(newJudgementBullet);
    }
    constructor({ x, y, velocity, lifetime }) {
        this.position = {
            x: x,
            y: y,
        };
        this.velocity = velocity;
        this.maxLifetime = lifetime;
        this.lifetime = lifetime;
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
        Game.getInstance().enemyList.splice(Game.getInstance().enemyList.indexOf(this), 1);
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/attack/bullet', 'judgement_bullet', Math.round((this.lifetime / this.maxLifetime) * 4) + 1, (img) => {
            ctx.drawImage(
                img,
                this.position.x,
                this.position.y,
                img.width ,
                img.height
            );
        });
    }
}
