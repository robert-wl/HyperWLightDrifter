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
        this.damaged = false;
        this.velocity = {
            value: 0,
            angle: 0,
        }
    }

    damage({ amount, angle }) {
        this.health -= amount;
        this.damaged = 5;
        if (this.health <= 0) {
            this.health = 0;
        }
        this.velocity = {
            value: 2,
            angle: angle,
        }
    }

    knockback() {
        this.position.x += Math.cos(this.velocity.angle) * this.velocity.value
        this.position.y += Math.sin(this.velocity.angle) * this.velocity.value
        this.velocity.value *= 0.9;
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
