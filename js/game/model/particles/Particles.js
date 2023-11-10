import Game from '../game/Game.js';
import Animateable from '../utility/Animateable.js';
export default class Particles extends Animateable {
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
