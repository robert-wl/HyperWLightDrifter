import Game from '../Game/Game.js';
import Animateable from '../Animateable.js';


export default class Particles extends Animateable {
    constructor({ position, speed, lifeSpan, width, height, canvas }) {
        super();
        this.position = position;
        this.speed = speed;
        this.lifeSpan = lifeSpan;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.number = 0;
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }
}
