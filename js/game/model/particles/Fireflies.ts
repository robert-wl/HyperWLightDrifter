import Particles from './Particles.js';
import Game from '../game/Game.js';
import AssetManager from '../utility/manager/AssetManager.js';
import RandomHelper from '../utility/helper/RandomHelper.js';
import { PolarVector } from '../utility/interfaces/PolarVector.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';

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
            this.rotation = RandomHelper.randomValue(0, 4, true) / 2;
        }

        const speed = this.speed * Game.deltaTime;

        const pVector = new PolarVector(speed, this.angle);
        this.position.x += DistanceHelper.getHorizontalValue(pVector);
        this.position.y += DistanceHelper.getVerticalValue(pVector);

        this.drawImage();

        if (this.lifeSpan === 0) {
            this.destroy();
        }
    }

    destroy() {
        this.eventEmitter.notify('destroyParticles', this);
    }

    drawImage() {
        const firefly = AssetManager.getNumberedImage('fireflies', (this.lifeSpan % 4) + 1);

        this.canvas.globalAlpha = this.lifeSpan / 5;

        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: firefly.width * this.size,
            h: firefly.height * this.size,
        });

        DrawHelper.drawRotated(firefly, imageSize, this.rotation * Math.PI, false, this.canvas);

        this.canvas.globalAlpha = 1;
    }
}
