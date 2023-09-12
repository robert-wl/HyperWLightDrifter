import Enemy from '../Enemy.js';
import Game from '../../Game/Game.js';
import CrystalSpiderBaseState from './state/CrystalSpiderBaseState.js';
import CrystalSpiderMoveState from './state/CrystalSpiderMoveState.js';
import CrystalSpiderAttackState from './state/CrystalSpiderAttackState.js';
import CrystalSpiderDieState from './state/CrystalSpiderDieState.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import EnemyManager from "../EnemyManager.js";
import {getRandomValue} from "../../../helper/randomHelper.js";

export default class CrystalSpider extends Enemy {
    static generate({ x, y }) {
        const newCrystalSpider = new CrystalSpider({
            x,
            y,
        });
        EnemyManager.getInstance().enemyList.push(newCrystalSpider);
    }
    constructor({ x, y }) {
        super({
            x,
            y,
            hitbox: {
                x: 10,
                y: 10,
                w: 20,
                h: 10,
            },
            w: 66,
            h: 50,
            health: 1,
        });
        this.currState = new CrystalSpiderBaseState();
        this.attackState = new CrystalSpiderAttackState();
        this.moveState = new CrystalSpiderMoveState();
        this.dieState = new CrystalSpiderDieState();
        this.speed = getRandomValue({
            initialValue: 1,
            randomValue: 3,
        });
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

        if(this.health <= 0 && this.currState !== this.dieState) {
            this.switchState(this.dieState);
        }

        this.currState.updateState(this);

        // if(this.currState !== this.dieState) {
        //     renderShadow({
        //         position: {
        //             x: this.position.x - this.width / 2 + 10,
        //             y: this.position.y - this.height / 2,
        //         },
        //         sizeMultiplier: 1.5,
        //     });
        // }

        if(this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
        this.currState.drawImage(this);
        if(this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= 1;
        }
    }
}
