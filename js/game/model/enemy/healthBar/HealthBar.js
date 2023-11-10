import { Vector } from '../../utility/interfaces/Vector.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
import { Box } from '../../utility/interfaces/Box.js';
export default class HealthBar {
    constructor(offset, maxHealth, HUD) {
        this.width = maxHealth * 14 + 6;
        this.offset = offset;
        this.maxHealth = maxHealth;
        this.translate = true;
        if (HUD) {
            this.ctx = HUD;
            this.translate = false;
            return;
        }
    }
    update({ health, position, bypass = false }) {
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
            DrawHelper.setTranslate(new Vector(-this.width / 4, 0), this.ctx);
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
            DrawHelper.setTranslate(new Vector(this.width / 4, 0), this.ctx);
        }
    }
    drawOuterBox({ x, y }) {
        DrawHelper.setFillStyle('rgb(255, 75, 75, 0.5)', this.ctx);
        DrawHelper.drawRectangle(new Box(x, y, this.width / 2 + 3, 5 + 8), this.ctx);
    }
    drawInnerBox({ x, y }) {
        DrawHelper.setFillStyle('rgb(50, 50, 50, 0.9)', this.ctx);
        DrawHelper.drawRectangle(new Box(x, y, this.width / 2 - 1, 5 + 4), this.ctx);
    }
    drawHealthBox({ x, y, health }) {
        for (let i = 0; i < health; i++) {
            DrawHelper.setFillStyle('rgb(255, 75, 75, 0.5)', this.ctx);
            DrawHelper.drawRectangle(new Box(x + i * 7, y, 5, 5), this.ctx);
        }
    }
}
