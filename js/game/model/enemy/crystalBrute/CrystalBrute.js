import Enemy from "../Enemy.js";
import Game from "../../Game.js";
import renderShadow from "../../../helper/renderer/shadow.js";
import CrystalBruteBaseState from "./state/CrystalBruteBaseState.js";
import CrystalBruteAttackState from "./state/CrystalBruteAttackState.js";
import CrystalBruteDieState from "./state/CrystalBruteDieState.js";
import CrystalBruteMoveState from "./state/CrystalBruteMoveState.js";

export default class CrystalBrute extends Enemy {
    static generate({ x, y }) {
        const newCrystalBrute = new CrystalBrute({
            x,
            y,
        });
        Game.getInstance().enemyList.push(newCrystalBrute);
    }
    constructor({ x, y }) {
        super({
            x,
            y,
            w: 136,
            h: 140,
            health: 10,
        });
        this.currState = new CrystalBruteBaseState();
        this.attackState = new CrystalBruteAttackState();
        this.moveState = new CrystalBruteMoveState();
        this.dieState = new CrystalBruteDieState();
        this.speed = 3;
        this.attack = [];
        this.switchState(this.moveState);
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    update() {
        if (Game.getInstance().debug) {
            this.debugMode();
        }
        this.currState.updateState(this);
        renderShadow({
            position: {
                x: this.position.x - 45,
                y: this.position.y ,
            },
            sizeMultiplier: 3,
        });

        for (const attack of this.attack) {
            const remove = attack.update();
            if (remove) {
                this.attack.splice(this.attack.indexOf(attack), 1);
            }
        }

        this.currState.drawImage(this);
    }
}
