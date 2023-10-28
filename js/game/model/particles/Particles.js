import Game from '../Game/Game.js';
import Animateable from '../Animateable.js';

export default class Particles extends Animateable {
    constructor({ position, speed, lifeSpan, canvas }) {
        super();
        this.position = position;
        this.speed = speed;
        this.lifeSpan = lifeSpan;
        this.canvas = canvas;
        this.number = 0;
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }
}
