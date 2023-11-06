import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import CrystalSpiderBaseState from './state/CrystalSpiderBaseState.js';
import CrystalSpiderMoveState from './state/CrystalSpiderMoveState.js';
import CrystalSpiderAttackState from './state/CrystalSpiderAttackState.js';
import CrystalSpiderDieState from './state/CrystalSpiderDieState.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import { getRandomValue } from '../../../helper/randomHelper.js';
import CrystalSpiderIdleState from './state/CrystalSpiderIdleState.js';

export default class CrystalSpider extends Enemy {
    constructor({ x, y }) {
        super({
            x: x,
            y: y,
            hitbox: {
                x: -66 / 2,
                y: -50 / 2,
                w: 0,
                h: 0,
            },
            w: 66,
            h: 50,
            health: 1,
        });
        this.currState = new CrystalSpiderBaseState();
        this.attackState = new CrystalSpiderAttackState();
        this.moveState = new CrystalSpiderMoveState();
        this.dieState = new CrystalSpiderDieState();
        this.idleState = new CrystalSpiderIdleState();
        this.speed = getRandomValue({
            initialValue: 2,
            randomValue: 2,
        });
        this.angle = Math.random() * 2 * Math.PI;
        this.switchState(this.idleState);
    }

    static generate({ x, y }) {
        const newCrystalSpider = new CrystalSpider({
            x,
            y,
        });

        const { enemyList } = Game.getInstance().enemyManager;
        enemyList.push(newCrystalSpider);
    }

    debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';
        ctx.fillRect(this.position.x + this.hitbox.x, this.position.y + this.hitbox.y, this.width - this.hitbox.w, this.height - this.hitbox.h);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    update() {
        const { debug, deltaTime } = Game.getInstance();
        if (debug) {
            this.debugMode();
        }

        if (this.health <= 0 && this.currState !== this.dieState) {
            this.switchState(this.dieState);
        }

        this.currState.updateState(this);

        if (this.currState !== this.dieState) {
            renderShadow({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
                sizeMultiplier: 1.5,
            });
        }

        if (this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }

        this.currState.drawImage(this);

        if (this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= deltaTime;
        }
    }

    clear() {
        const { enemyList } = Game.getInstance().enemyManager;
        enemyList.splice(enemyList.indexOf(this), 1);
    }
}
