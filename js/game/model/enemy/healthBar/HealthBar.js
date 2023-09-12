import Game from '../../Game/Game.js';

export default class HealthBar {
    static generate({ position, offset, maxHealth, HUD }) {
        return new HealthBar({ position, offset, maxHealth, HUD });
    }
    constructor({ position, offset, maxHealth, HUD }) {
        this.width = maxHealth * 14 + 6;
        this.height = 10;
        this.position = position;
        this.offset = offset;
        this.maxHealth = maxHealth;
        this.ctx = HUD || Game.getInstance().ctx;
    }

    update({ health, position }) {
        this.draw({ health, position });
    }

    draw({ health, position }) {
        //TODO REVISIT
        if (health === this.maxHealth) {
            return;
        }
        this.ctx.translate(-this.width, -this.height / 2);

        const x = position.x + this.offset.x + this.width / 2;
        const y = position.y + this.offset.y;

        this.drawOuterBox({
            x: x + this.width / 4 - 4,
            y: y + this.height - 4,
        });

        this.drawInnerBox({
            x: x + this.width / 4 - 2,
            y: y + this.height - 2,
        })

        this.drawHealthBox({
            x: x + this.width / 4,
            y: y + this.height,
            health: health,
        });

        this.ctx.translate(this.width, this.height / 2);
    }

    drawOuterBox({ x, y }) {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 75, 75, 0.5)';
        ctx.fillRect(x, y, this.width / 2 + 3, 5 + 8);
    }

    drawInnerBox({ x, y }){
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
