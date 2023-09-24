import Game from '../Game/Game.js';


export default class Particles {
    constructor({ position, speed, lifeSpan, width, height, canvas }) {
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

    checkCounter(number) {
        return this.number >= number;
    }
}
