import Enemy from "../Enemy.js";
import JudgementBaseState from "./state/JudgementBaseState.js";
import JudgementSpawnState from "./state/JudgementSpawnState.js";
import Game from "../../Game.js";
import JudgementMoveState from "./state/JudgementMoveState.js";
import JudgementAttackState from "./state/JudgementAttackState.js";


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
                w: 60,
                h: 30,
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

        this.switchState(this.spawnState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
    }
}
