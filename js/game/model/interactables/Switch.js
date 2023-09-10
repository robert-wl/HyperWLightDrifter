import Collideable from "../collideable/Collideable.js";
import Game from "../Game/Game.js";
import {get_image} from "../../helper/fileReader.js";


export default class Switch extends Collideable {

    static generate({x, y, w, h, collideable }) {
        const newSwitch = new Switch({
            x,
            y,
            w,
            h,
            collideable
        });

        Game.getInstance().collideable.push(newSwitch);
        Game.getInstance().renderList.push(newSwitch);
    }
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.stage = "off";
        this.number = 1;
        this.activatingStage = 1;
    }
    update(){
        this.render();
        if(this.stage === "activating") {
            this.activateUpdate();
        }
    }
    render() {
        const ctx = Game.getInstance().ctx;
        if(this.stage === "off") {
            get_image("switch", "switch_off", 1, (image) => {
                ctx.drawImage(image, this.x, this.y, this.w, this.h);
            });
        }
        if(this.stage === "activating") {
            get_image("switch", "switch_activating", this.activatingStage, (image) => {
                ctx.drawImage(image, this.x, this.y, this.w, this.h);
            });
        }
    }
    activateUpdate() {

    }
    handleActivate() {
        this.stage = "activating";
        this.activatingStage = 1;
    }
}
