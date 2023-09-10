import Particles from './Particles.js';
import Game from '../Game/Game.js';
import { get_image } from '../../helper/fileReader.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import {randomizeValue} from "../../helper/randomHelper.js";
import {getHorizontalValue, getVerticalValue} from "../../helper/distanceHelper.js";
import {getNumberedImage} from "../../helper/imageLoader.js";

export default class Fireflies extends Particles {
    static generate() {
        const { position } = Game.getInstance().player;

        const x = position.x + randomizeValue({
            initialValue: -1,
            randomValue: 2,
        }) * 1500;
        const y = position.y + randomizeValue({
            initialValue: -1,
            randomValue: 2,
        }) * 1500;

        const width = randomizeValue({
            initialValue: 5,
            randomValue: 10,
        });
        const height = randomizeValue({
            initialValue: 5,
            randomValue: 10,
        });
        const lifeSpan = Math.round(randomizeValue({
            initialValue: 2,
            randomValue: 20,
        }));

        const speed = randomizeValue({
            initialValue: -1,
            randomValue: 2,
        }) * 0.25;

        const angle = randomizeValue({
            initialValue: 0,
            randomValue: Math.PI * 2,
        });

        const newFireflies = new Fireflies({
            position: { x, y },
            speed: speed,
            angle: angle,
            lifeSpan: lifeSpan,
            width: width,
            height: height,
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

        if (this.number % 20 === 0) {
            this.lifeSpan -= 1;
            this.number = 0;
            this.rotation = Math.round(randomizeValue({
                randomValue: 4,
            })) / 2;
        }

        this.position.x += getHorizontalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: this.speed,
            angle: this.angle,
        });

        this.drawImage();

        if (this.lifeSpan === 0) {
            this.destroy();
        }
    }

    destroy() {
        const { particles } = Game.getInstance();

        particles.splice(particles.indexOf(this), 1);
    }

    drawImage() {
        const { ctx } = Game.getInstance();

        const firefly = getNumberedImage('fireflies', (this.lifeSpan % 4) + 1);

        ctx.globalAlpha = this.lifeSpan / 22;

        drawRotated({
            img: firefly,
            angle: this.rotation * Math.PI,
            position: this.position,
        });

        ctx.globalAlpha = 1;
    }
}
