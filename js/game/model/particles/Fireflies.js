import Particles from './Particles.js';
import Game from '../Game.js';
import { get_image } from '../../helper/fileReader.js';
import { drawRotated } from '../../helper/renderer/drawer.js';

export default class Fireflies extends Particles {
    static generate() {
        const x = Game.getInstance().player.position.x + (Math.random() * 2 - 1) * 1500;
        const y = Game.getInstance().player.position.y + (Math.random() * 2 - 1) * 1500;
        const width = 5 + Math.random() * 10;
        const height = 5 + Math.random() * 10;
        const lifeSpan = Math.round(2 + Math.random() * 20);
        const speed = (Math.random() * 2 - 1) * 0.25;
        const angle = Math.random() * Math.PI * 2;
        const newFireflies = new Fireflies({
            position: { x, y },
            speed,
            angle,
            lifeSpan,
            width,
            height,
        });
        Game.getInstance().particles.push(newFireflies);
    }
    constructor({ position, speed, angle, lifeSpan, width, height }) {
        super({
            position,
            speed,
            lifeSpan,
            width,
            height,
        });
        this.angle = angle;
        this.number = 0;
        this.rotation = 0;
    }
    update() {
        this.number++;
        if (this.number === 20) {
            this.lifeSpan -= 1;
            this.number = 0;
            this.rotation = Math.round(Math.random() * 4) / 2;
        }
        // this.speed *= 0.98;
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;
        this.drawImage();
        if (this.lifeSpan === 0) {
            this.destroy();
        }
    }

    destroy() {
        const index = Game.getInstance().particles.indexOf(this);
        Game.getInstance().particles.splice(index, 1);
    }

    drawImage() {
        const ctx = Game.getInstance().canvasCtx;

        get_image('particles/firefly', 'fireflies', (this.lifeSpan % 4) + 1, (image) => {
            ctx.globalAlpha = this.lifeSpan / 22;
            drawRotated({
                canvas: ctx,
                img: image,
                angle: this.rotation * Math.PI,
                position: this.position,
            });
            ctx.globalAlpha = 1;
        });
    }
}
