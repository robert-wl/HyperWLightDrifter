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
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    checkCollision({ x, y, w, h }){
        if(!this.collideable) {
            return false;
        }
        return !(
            this.x + this.w >= x &&
            this.x <= x + w &&
            this.y + this.h >= y &&
            this.y <= y + h
        );
    }

}
