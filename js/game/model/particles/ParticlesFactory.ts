import Observable from '../utility/Observable.js';
import Game from '../game/Game.js';
import Fireflies from './Fireflies.js';
import { Vector } from '../utility/interfaces/Vector.js';
import RandomHelper from '../utility/helper/RandomHelper.js';

export default class ParticlesFactory {
    private eventEmitter: Observable;

    public constructor(eventEmitter: Observable) {
        this.eventEmitter = eventEmitter;
    }

    public generateFireflies(distance: number, lifespan: number, speed: number, position: Vector, canvas: CanvasRenderingContext2D) {
        const spawnPosition = position || Game.getInstance().player;

        const distanceConst = distance || 1500;
        const x = spawnPosition.x + RandomHelper.randomValue(-1, 2) * distanceConst;
        const y = spawnPosition.y + RandomHelper.randomValue(-1, 2) * distanceConst;

        const size = RandomHelper.randomValue(1, 2);
        const lifeSpanLength = lifespan || RandomHelper.randomValue(2, 20, true);

        const updateSpeed = speed || RandomHelper.randomValue(-1, 2) * 0.25;

        const angle = RandomHelper.randomValue(0, Math.PI * 2);

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
