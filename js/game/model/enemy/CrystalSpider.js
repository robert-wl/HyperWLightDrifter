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
        this.counter = 0;
        this.animationStage = 0;
    }

    update() {
        this.move();
        this.render();
        this.counter++;
    }
    move(){
        const x = Game.getInstance().player.position.x - this.position.x;
        const y = Game.getInstance().player.position.y - this.position.y;
        this.angle = Math.atan2(y, x);
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;
    }
    render() {
        const ctx = Game.getInstance().canvasCtx;

        if(this.counter === 4){
            this.animationStage = (this.animationStage + 1) % 4;
            this.counter = 0;
        }
        get_image("enemy/crystal_spider", "crystal_spider_walk", this.animationStage + 1, (image) => {
            if(this.angle > 0 && this.angle < Math.PI / 2 || this.angle < 0 && this.angle > -Math.PI / 2){
                ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height);
            }
            else {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -this.position.x - this.width, this.position.y, this.width, this.height);
                ctx.scale(-1, 1);
            }
        });
    }
}
