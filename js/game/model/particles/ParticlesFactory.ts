import Observable from '../utility/Observable.js';
import Game from '../game/Game.js';
import { getRandomValue } from '../../helper/randomHelper.js';
import Fireflies from './Fireflies.js';
import { Vector } from '../utility/enums/Vector.js';

export default class ParticlesFactory {
    private eventEmitter: Observable;

    public constructor(eventEmitter: Observable) {
        this.eventEmitter = eventEmitter;
    }

    public generateFireflies(distance: number, lifespan: number, speed: number, position: Vector, canvas: CanvasRenderingContext2D) {
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
            eventEmitter: this.eventEmitter,
        });

        this.eventEmitter.notify('spawnParticles', newFireflies);
    }
}
