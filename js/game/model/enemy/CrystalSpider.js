import Enemy from './Enemy.js';
import Game from "../Game.js";
import {get_image} from "../../helper/fileReader.js";
import CrystalSpiderBaseState from "./state/CrystalSpiderBaseState.js";
import CrystalSpiderMoveState from "./state/CrystalSpiderMoveState.js";
import CrystalSpiderAttackState from "./state/CrystalSpiderAttackState.js";
import CrystalSpiderDieState from "./state/CrystalSpiderDieState.js";

export default class CrystalSpider extends Enemy {
    static generate({ x, y }) {
        const newCrystalSpider = new CrystalSpider({
            x,
            y,
        });
        Game.getInstance().enemyList.push(newCrystalSpider);
    }
    constructor({ x, y }) {
        super({
            x,
            y,
            w: 66,
            h: 50,
            health: 1
        });
        this.currState = new CrystalSpiderBaseState();
        this.attackState = new CrystalSpiderAttackState();
        this.moveState = new CrystalSpiderMoveState();
        this.dieState = new CrystalSpiderDieState();
        this.speed = 3;
        this.switchState(this.moveState);
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    update() {
        if(Game.getInstance().debug) {
            this.debugMode();
        }
        this.currState.updateState(this);
        this.currState.drawImage(this);
    }
    debugMode(){
        const ctx = Game.getInstance().canvasCtx;
        ctx.fillStyle = "rgb(255, 0, 0, 0.4)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
