import Enemy from '../Enemy.js';
import { getRandomValue } from '../../../helper/randomHelper.js';
import Game from '../../Game/Game.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import CrystalWolfBaseState from './state/CrystalWolfBaseState.js';
import CrystalWolfAttackState from './state/CrystalWolfAttackState.js';
import CrystalWolfMoveState from './state/CrystalWolfMoveState.js';
import CrystalWolfDieState from './state/CrystalWolfDieState.js';
import HealthBar from '../healthBar/HealthBar.js';

export default class CrystalWolf extends Enemy {
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
            w: 66 * 1.1,
            h: 50 * 1.1,
            health: 2,
            maxHealth: 2,
        });
        this.currState = new CrystalWolfBaseState();
        this.attackState = new CrystalWolfAttackState();
        this.moveState = new CrystalWolfMoveState();
        this.dieState = new CrystalWolfDieState();
        this.speed = getRandomValue({
            initialValue: 3,
            randomValue: 2,
        });
        this.healthBar = HealthBar.generate({
            position: this.position,
            offset: {
                x: -5,
                y: 30,
            },
            maxHealth: this.maxHealth,
        });
        this.switchState(this.moveState);
    }

    static generate({ x, y }) {
        const newCrystalWolf = new CrystalWolf({
            x,
            y,
        });

        const { enemyManager } = Game.getInstance();
        enemyManager.enemyList.push(newCrystalWolf);
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

        if (this.currState !== this.dieState) {
            this.healthBar.update({
                health: this.health,
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
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
}
