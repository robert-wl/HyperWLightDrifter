import Game from '../Game.js';
import { get_image } from '../../helper/fileReader.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import enemyCollision from '../../helper/collision/enemyCollision.js';

export default class GunProjectile {
    static generate({ position, angle }) {
        const speed = 10;
        Game.getInstance().player.projectiles.push(
            new GunProjectile({
                position,
                angle,
                speed,
            }),
        );
    }
    constructor({ position, angle, speed }) {
        this.position = {
            x: position.x,
            y: position.y,
        };
        this.player = Game.getInstance().player;
        this.angle = angle;
        this.speed = speed;
        this.lifetime = 100;
    }

    update() {
        this.lifetime--;

        if (this.lifetime === 0) {
            const index = Game.getInstance().player.projectiles.indexOf(this);
            Game.getInstance().player.projectiles.splice(index, 1);
            return;
        }
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;

        let enemy = null;
        if (
            (enemy = enemyCollision({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
            }))
        ) {
            enemy.damage({
                amount: 1,
                angle: this.player.lookAngle,
            });
            this.lifetime = 1;
            return;
        }
        this.render();
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
        get_image('player/aim/gun', 'projectile', null, (img) => {
            drawRotated({
                canvas: ctx,
                img: img,
                position: this.position,
                angle: this.angle + 3 * Math.PI,
            });
        });
    }
}
