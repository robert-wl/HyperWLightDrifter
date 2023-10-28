import Particles from './Particles.js';
import Game from '../Game/Game.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import { getRandomValue } from '../../helper/randomHelper.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import ParticlesManager from './ParticlesManager.js';

export default class Fireflies extends Particles {
    constructor({ position, speed, angle, lifeSpan, size, canvas }) {
        super({
            position,
            speed,
            lifeSpan,
            canvas,
        });
        this.size = size;
        this.angle = angle;
        this.rotation = 0;
    }

    static generate({ canvas, distance, position, speed, lifespan }) {
        const spawnPosition = position || Game.getInstance().player;

        const distanceConst = distance || 1500;
        const x =
            spawnPosition.x +
            getRandomValue({
                initialValue: -1,
                randomValue: 2,
            }) *
                distanceConst;
        const y =
            spawnPosition.y +
            getRandomValue({
                initialValue: -1,
                randomValue: 2,
            }) *
                distanceConst;

        const size = getRandomValue({
            initialValue: 1,
            randomValue: 2,
        });
        const lifeSpanLength =
            lifespan ||
            getRandomValue({
                initialValue: 2,
                randomValue: 20,
                rounded: true,
            });

        const updateSpeed =
            speed ||
            getRandomValue({
                initialValue: -1,
                randomValue: 2,
            }) * 0.25;

        const angle = getRandomValue({
            initialValue: 0,
            randomValue: Math.PI * 2,
        });

        const newFireflies = new Fireflies({
            position: { x, y },
            speed: updateSpeed,
            angle: angle,
            lifeSpan: lifeSpanLength,
            size: size,
            canvas: canvas,
        });

        ParticlesManager.getInstance().particleList.push(newFireflies);
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
        const { particleList } = ParticlesManager.getInstance();

        particleList.splice(particleList.indexOf(this), 1);
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
