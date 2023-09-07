import Game from '../../Game.js';
import { get_image } from '../../../helper/fileReader.js';
import Enemy from "../Enemy.js";
import {drawRotated} from "../../../helper/renderer/drawer.js";

export default class JudgementLaser extends Enemy {
    static generate({ x, y, angle }) {
        const newJudgementLaser = new JudgementLaser({
            x,
            y,
            velocity: {
                value: 12.5,
                angle: angle,
            },
            lifetime: 200 + Math.random() * 200,
        });
        Game.getInstance().enemyList.push(newJudgementLaser);
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
        this.imageAngle = Math.random() * 2 * Math.PI;
        this.velocity = velocity;
        this.maxLifetime = lifetime;
        this.lifetime = lifetime;
    }


    damage({amount, angle}) {

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
        Game.getInstance().enemyList.splice(Game.getInstance().enemyList.indexOf(this), 1);
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
        get_image('boss/laser', 'judgement_laser_bullet', null, (img) => {
            // drawRotated({
            //     canvas: ctx,
            //     img: img,
            //     position: {
            //         x: this.position.x,
            //         y: this.position.y,
            //     },
            //     angle: this.imageAngle,
            //     size: 1.5
            // })
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
