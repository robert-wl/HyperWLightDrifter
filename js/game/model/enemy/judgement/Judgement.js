import Enemy from "../Enemy.js";
import JudgementBaseState from "./state/JudgementBaseState.js";
import JudgementSpawnState from "./state/JudgementSpawnState.js";
import Game from "../../Game.js";
import JudgementMoveState from "./state/JudgementMoveState.js";
import JudgementAttackState from "./state/JudgementAttackState.js";
import JudgementLaserState from "./state/JudgementLaserState.js";


export default class Judgement extends Enemy {
    static generate({ x, y }) {
        const newJudgement = new Judgement({
            x,
            y,
            moveSpeed: 1,
        });
        Game.getInstance().enemyList.push(newJudgement);
    }
    constructor({ x, y, moveSpeed }) {
        super({
            x,
            y,
            hitbox: {
                x: 30,
                y: 30,
                w: 10,
                h: 10,
            },
            w: 136,
            h: 140,
            health: 100,
            maxHealth: 100,
        });

        this.angle = 0;
        this.moveSpeed = moveSpeed;

        this.currState = new JudgementBaseState();
        this.spawnState = new JudgementSpawnState();
        this.moveState = new JudgementMoveState();
        this.attackState = new JudgementAttackState();
        this.laserState = new JudgementLaserState();

        this.switchState(this.spawnState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    // switchStateHandler({ move, attack, laser }){
    //     if(move) {
    //         this.switchState(this.moveState);
    //     }
    //     else if(attack) {
    //         this.switchState(this.attackState);
    //     }
    //     else if(laser) {
    //         this.switchState(this.laserState);
    //     }
    // }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
    }
}
