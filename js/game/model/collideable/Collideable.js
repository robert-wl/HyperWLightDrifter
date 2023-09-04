import Game from "../Game.js";


export default class Collideable {
    static generate({x, y, w, h, collideable }) {
        const newCollideable = new Collideable({
            x,
            y,
            w,
            h,
            collideable
        });

        Game.getInstance().collideable.push(newCollideable);
    }
    constructor({ x, y, w, h, collideable }) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.collideable = collideable || true;
    }

    renderDebug() {
        const ctx = Game.getInstance().canvasCtx;
        ctx.fillStyle = "rgb(0, 255, 0, 0.2)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    checkCollision({ x, y, w, h }){
        if(!this.collideable) {
            return false;
        }
        return !(
            this.x + this.width >= x &&
            this.x <= x + w &&
            this.y + this.height >= y &&
            this.y <= y + h
        );
    }

    update() {
        if(Game.getInstance().debug) {
            this.renderDebug();
        }
    }

}
