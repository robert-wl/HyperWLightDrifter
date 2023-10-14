import Game from '../Game/Game.js';
import Animateable from '../Animateable.js';

export default class Collideable extends Animateable {
    constructor({ x, y, w, h, collideable }) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.collideable = collideable || true;
        this.number = 0;
        this.animationStage = 1;
    }

    static generate({ x, y, w, h, collideable }) {
        const newCollideable = new Collideable();

        Game.getInstance().collideables.push(newCollideable);
    }

    renderDebug() {
        const ctx = Game.getInstance().ctx;
        ctx.fillStyle = 'rgb(0, 255, 0, 0.2)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision({ x, y, w, h }) {
        if (!this.collideable) {
            return false;
        }
        return !(this.x + this.width >= x && this.x <= x + w && this.y + this.height >= y && this.y <= y + h);
    }

    update() {
        if (Game.getInstance().debug) {
            this.renderDebug();
        }
    }
}
