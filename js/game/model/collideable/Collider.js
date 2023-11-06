import Game from '../game/Game.js';

export default class Collider {
    constructor({ x, y, width, height }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.number = 0;
        this.animationStage = 1;
    }

    renderDebug() {
        const ctx = Game.getInstance().ctx;
        ctx.fillStyle = 'rgb(0, 255, 0, 0.2)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision({ x, y, w, h }) {
        if (Game.getInstance().renderCollider) {
            this.renderDebug();
        }
        return !(this.x + this.width >= x && this.x <= x + w && this.y + this.height >= y && this.y <= y + h);
    }

    update() {
        if (Game.getInstance().renderCollider) {
            this.renderDebug();
        }
    }
}
