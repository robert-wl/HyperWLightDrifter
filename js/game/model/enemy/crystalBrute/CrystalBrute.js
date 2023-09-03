import Enemy from "../Enemy.js";
import Game from "../../Game.js";
import renderShadow from "../../../helper/renderer/shadow.js";
import CrystalBruteBaseState from "./state/CrystalBruteBaseState.js";
import CrystalBruteAttackState from "./state/CrystalBruteAttackState.js";
import CrystalBruteDieState from "./state/CrystalBruteDieState.js";
import CrystalBruteMoveState from "./state/CrystalBruteMoveState.js";
import HealthBar from "../healthBar/HealthBar.js";

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
            hitbox: {
                x: 30,
                y: 30,
                w: 60,
                h: 30,
            },
            w: 136,
            h: 140,
            health: 10,
            maxHealth: 10,
        });
        this.currState = new CrystalBruteBaseState();
        this.attackState = new CrystalBruteAttackState();
        this.moveState = new CrystalBruteMoveState();
        this.dieState = new CrystalBruteDieState();
        this.speed = 3;
        this.attack = [];
        this.healthBar = HealthBar.generate({
            position: this.position,
            offset: {
                x: this.width / 2,
                y: 130,
            },
            maxHealth: this.maxHealth,
        });
        this.switchState(this.moveState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    update() {
        this.knockback();
        const ctx = Game.getInstance().canvasCtx;
        if (Game.getInstance().debug) {
            this.debugMode();
        }
        this.currState.updateState(this);

        if(this.currState !== this.dieState) {
            renderShadow({
                position: {
                    x: this.position.x - 45,
                    y: this.position.y ,
                },
                sizeMultiplier: 3,
            });
        }

        if(this.currState !== this.dieState){
            this.healthBar.update({
                health: this.health
            });
        }


        for (const attack of this.attack) {
            const remove = attack.update();
            if (remove) {
                this.attack.splice(this.attack.indexOf(attack), 1);
            }
        }

        if(this.damaged >= 0) {
            ctx.filter = 'sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)'
        }

        this.currState.drawImage(this);

        if(this.damaged >= 0) {
            ctx.filter = 'none';
            this.damaged--;
        }
    }
}
