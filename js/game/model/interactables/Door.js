import Collideable from '../collideable/Collideable.js';
import {get_image} from "../../helper/fileReader.js";
import Game from "../Game.js";

export default class Door extends Collideable {
    static generate({ x, y, collideable }) {
        const newDoor = new Door({
            x,
            y,
            w: 104,
            h: 138,
            collideable
        });
        Game.getInstance().collideable.push(newDoor);
    }
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.isLocked = true;
    }

    update() {
        this.render();
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
        get_image('world/door', 'door', Game.getInstance().difficulty > 9 ? 9 : Game.getInstance().difficulty, (img) => {
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        });
    }
}
