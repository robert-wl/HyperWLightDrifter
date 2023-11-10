import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import CrystalBruteBaseState from './state/CrystalBruteBaseState.js';
import CrystalBruteAttackState from './state/CrystalBruteAttackState.js';
import CrystalBruteDieState from './state/CrystalBruteDieState.js';
import CrystalBruteMoveState from './state/CrystalBruteMoveState.js';
import HealthBar from '../healthBar/HealthBar.js';
import CrystalBruteIdleState from './state/CrystalBruteIdleState.js';
import { Vector } from '../../utility/interfaces/Vector.js';
export default class CrystalBrute extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this._speed = 3;
        this._angle = 0;
        this.attack = [];
        const offset = new Vector(5, 75);
        this.healthBar = new HealthBar(offset, this.maxHealth);
        this.currState = new CrystalBruteBaseState();
        this.attackState = new CrystalBruteAttackState();
        this.moveState = new CrystalBruteMoveState();
        this.dieState = new CrystalBruteDieState();
        this.idleState = new CrystalBruteIdleState();
        this.switchState(this.idleState);
    }
    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }
    update() {
        this.knockback();
        if (Game.debug) {
            this.debugMode();
        }
        this.currState.updateState(this);
        if (this.currState !== this.dieState) {
            renderShadow({
                position: {
                    x: this.position.x,
                    y: this.position.y + 27.5,
                },
                sizeMultiplier: 3,
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
        this.attack.forEach((attack) => {
            if (attack.update()) {
                this.attack.splice(this.attack.indexOf(attack), 1);
            }
        });
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
        this.currState.drawImage(this);
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= Game.deltaTime;
        }
    }
}
