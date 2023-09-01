import Game from "../Game.js";

export default class Enemy {
    constructor({ x, y, w, h, health }) {
        this.position = {
            x: x,
            y: y,
        };
        this.health = health;
        this.width = w;
        this.height = h;
        this.image = null;
    }

    debugMode() {
        const ctx = Game.getInstance().canvasCtx;
        ctx.fillStyle = 'rgb(255, 0, 0, 0.4)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
