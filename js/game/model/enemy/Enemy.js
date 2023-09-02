import Game from "../Game.js";

export default class Enemy {
    constructor({ x, y, hitbox, w, h, health, maxHealth }) {
        this.position = {
            x: x,
            y: y,
        };
        this.hitbox = hitbox;
        this.health = health;
        this.maxHealth = maxHealth;
        this.width = w;
        this.height = h;
        this.image = null;
    }

    debugMode() {
        const ctx = Game.getInstance().canvasCtx;
        ctx.fillStyle = 'rgb(255, 0, 0, 0.4)';
        ctx.fillRect(
            this.position.x + this.hitbox.x,
            this.position.y + this.hitbox.y,
            this.width - this.hitbox.w,
            this.height - this.hitbox.h
        );
    }
}
