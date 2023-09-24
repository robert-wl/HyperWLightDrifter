import Game from '../../Game/Game.js';

export default class HealthBar {
    constructor({ position, offset, maxHealth, HUD }) {
        this.width = maxHealth * 14 + 6;
        this.height = 10;
        this.position = position;
        this.offset = offset;
        this.maxHealth = maxHealth;

        if (HUD) {
            this.ctx = HUD;
            this.translate = false;
            return;
        }
        this.ctx = Game.getInstance().ctx;
        this.translate = true;
    }

    static generate({ position, offset, maxHealth, HUD }) {
        return new HealthBar({ position, offset, maxHealth, HUD });
    }

    update({ health, position, bypass }) {
        this.draw({ health, position, bypass });
    }

    draw({ health, position, bypass }) {
        if (health === this.maxHealth && !bypass) {
            return;
        }

        if (health <= 0) {
            return;
        }

        if (this.translate) {
            this.ctx.translate(-this.width / 4, 0);
        }

        const x = position.x + this.offset.x;
        const y = position.y + this.offset.y;

        this.drawOuterBox({
            x: x - 4,
            y: y - 4,
        });

        this.drawInnerBox({
            x: x - 2,
            y: y - 2,
        });

        this.drawHealthBox({
            x: x,
            y: y,
            health: health,
        });

        if (this.translate) {
            this.ctx.translate(this.width / 4, 0);
        }
    }

    drawOuterBox({ x, y }) {
        this.ctx.fillStyle = 'rgb(255, 75, 75, 0.5)';
        this.ctx.fillRect(x, y, this.width / 2 + 3, 5 + 8);
    }

    drawInnerBox({ x, y }) {
        this.ctx.fillStyle = 'rgb(50, 50, 50, 0.9)';

        this.ctx.fillRect(x, y, this.width / 2 - 1, 5 + 4);
    }

    drawHealthBox({ x, y, health }) {
        for (let i = 0; i < health; i++) {
            this.ctx.fillStyle = 'rgb(255, 75, 75, 0.5)';
            this.ctx.fillRect(x + i * 7, y, 5, 5);
        }
    }
}
