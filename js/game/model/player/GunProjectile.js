import Game from '../Game/Game.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import enemyCollision from '../../helper/collision/enemyCollision.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { getImage } from '../../helper/imageLoader.js';

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
        this.lifetime -= 1;

        if (this.lifetime === 0) {
            const { projectiles } = Game.getInstance().player;
            projectiles.splice(projectiles.indexOf(this), 1);

            return;
        }

        this.position.x += getHorizontalValue({
            magnitude: this.speed,
            angle: this.angle,
        });
        this.position.y += getVerticalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        let enemy = null;
        if (
            (enemy = enemyCollision({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
            }))
        ) {
            const { audio } = Game.getInstance();
            audio.playAudio('player/bullet_hit.wav');
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
        const projectile = getImage('projectile');

        drawRotated({
            img: projectile,
            position: this.position,
            angle: this.angle + 3 * Math.PI,
        });
    }
}
