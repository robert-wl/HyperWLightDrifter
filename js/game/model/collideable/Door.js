import Collideable from './Collideable.js';
import {get_image} from "../../helper/fileReader.js";
import Game from "../Game.js";

export default class Door extends Collideable {
    static generate({ x, y, collideable }) {
        const newDoor = new Door({
            x,
            y,
            w: 104,
            h: 116,
            collideable
        });
        Game.getInstance().collideable.push(newDoor);
    }
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.isLocked = true;
        this.number = 0;
        this.animationStage = 0;
    }

    update() {
        this.number++;
        if(this.number % 1 === 0) {
            this.animationStage++;
        }
        this.render();
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
        // get_image('world/door', 'door', (this.animationStage % 12) + 1, (img) => {
        //     ctx.drawImage(img, this.x, this.y, this.width, this.height);
        // });
    }
}
