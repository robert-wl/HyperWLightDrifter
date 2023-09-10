import Game from "../../Game/Game.js";


export default class HealthBar {
    static generate({ position, offset, maxHealth }) {
        return new HealthBar({ position, offset, maxHealth });
    }
    constructor({ position, offset, maxHealth }) {
        this.width = maxHealth * 13 + 6;
        this.height = 10;
        this.position = position;
        this.offset = offset;
        this.maxHealth = maxHealth;
        this.ctx = Game.getInstance().ctx;
    }

    update({ health, x, y }) {
        this.draw({ health, xOff: x, yOff: y });
    }

    draw({ health, xOff, yOff }) {

        const x = (xOff || this.position.x) + this.offset.x - this.width / 2;
        const y = (yOff || this.position.y) + this.offset.y;
        this.ctx.fillStyle = "rgb(255, 75, 75, 0.5)";
        this.ctx.fillRect(
            (x + this.width / 4) - 4,
            (y + this.height) - 4,
            this.width / 2 + 4,
            5 + 8
        );
        this.ctx.fillStyle = "rgb(50, 50, 50, 0.9)";
        this.ctx.fillRect(
            (x + this.width / 4) - 2,
            (y + this.height) - 2,
            this.width / 2,
            5 + 4
        );
        for(let i = 0; i < health; i++){
            const posX = (x + this.width / 4) + (i * 7);
            const posY = y + this.height;
            this.ctx.fillStyle = "rgb(255, 75, 75, 0.5)";
            this.ctx.fillRect(posX, posY, 5, 5);
        }
        this.ctx.fillStyle = "rgb(255, 75, 75, 0.5)";
    }

}
