import Particles from './Particles.js';
import Game from '../game/Game.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import { getRandomValue } from '../../helper/randomHelper.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';

export default class Fireflies extends Particles {
    private size: number;
    private angle: number;
    private rotation: number;

    constructor({ position, speed, angle, lifeSpan, size, canvas, eventEmitter }) {
        super({
            position,
            speed,
            lifeSpan,
            canvas,
            eventEmitter,
        });
        this.size = size;
        this.angle = angle;
        this.rotation = 0;
    }

    update() {
        super.update();

        if (this.checkCounter(20)) {
            this.lifeSpan -= 1;
            this.number = 0;
            this.rotation =
                Math.round(
                    getRandomValue({
                        randomValue: 4,
                    }),
                ) / 2;
        }

        const { deltaTime } = Game.getInstance();
        const speed = this.speed * deltaTime;

        this.position.x += getHorizontalValue({
            magnitude: speed,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: speed,
            angle: this.angle,
        });

        this.drawImage();

        if (this.lifeSpan === 0) {
            this.destroy();
        }
    }

    destroy() {
        this.eventEmitter.notify('destroyParticles', this);
    }

    drawImage() {
        const firefly = getNumberedImage('fireflies', (this.lifeSpan % 4) + 1);

        const canvas = this.canvas || Game.getInstance().ctx;
        canvas.globalAlpha = this.lifeSpan / 5;

        drawRotated({
            canvas: canvas,
            img: firefly,
            angle: this.rotation * Math.PI,
            position: this.position,
            size: this.size,
        });

        canvas.globalAlpha = 1;
    }
}
