import Game from '../game/Game.js';
import Animateable from '../utility/Animateable.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Observable from '../utility/Observable.js';

export default class Particles extends Animateable {
    protected position: Vector;
    protected speed: number;
    protected lifeSpan: number;
    protected canvas: CanvasRenderingContext2D;
    protected eventEmitter: Observable;

    constructor({ position, speed, lifeSpan, canvas, eventEmitter }) {
        super();
        this.position = position;
        this.speed = speed;
        this.lifeSpan = lifeSpan;
        this.canvas = canvas;
        this.number = 0;
        this.eventEmitter = eventEmitter;
    }

    update() {
        this.number += Game.deltaTime;
    }
}
