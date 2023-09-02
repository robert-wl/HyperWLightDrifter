import Collideable from "./Collideable.js";
import Game from "../Game.js";
import {get_image} from "../../helper/fileReader.js";
import renderShadow from "../../helper/renderer/shadow.js";


export default class Trader extends Collideable {
    static generate({x, y, collideable}) {
        const newTrader = new Trader({
            x,
            y,
            w: 92,
            h: 104,
            collideable: true
        });
        Game.getInstance().collideable.push(newTrader);
    }
    constructor({x, y, w, h, collideable}) {
        super({x, y, w, h, collideable});
        this.number = 0;
        this.animationStage = 0;
    };

    update() {
        this.render();
        this.number++;
        if(this.number === 40){
            this.animationStage++;
            this.number = 0;
        }
    }

    render(){
        const ctx = Game.getInstance().canvasCtx;
        renderShadow({
            position: {
                x: this.x - 75,
                y: this.y - 25,
            },
            sizeMultiplier: 3
        });
        get_image('other/trader', 'trader', (this.animationStage % 4) + 1, (img) => {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        });
    }
}
