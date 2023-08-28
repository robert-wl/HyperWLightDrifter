import Game from "../Game.js";


export default class Collideable {
    static generate({x, y, w, h}) {
        const newCollideable = new Collideable({
            x,
            y,
            w,
            h
        })

        Game.getInstance().collideable.push(newCollideable);
    }
    constructor({ x, y, w, h }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    renderDebug() {
        const ctx = Game.getInstance().canvasCtx;
        ctx.fillStyle = "rgb(0, 255, 0, 0.2)";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    
    checkCollision({ x, y, w, h }){
        return !(
            this.x + this.w >= x &&
            this.x <= x + w &&
            this.y + this.h >= y &&
            this.y <= y + h
        );

    }

}
