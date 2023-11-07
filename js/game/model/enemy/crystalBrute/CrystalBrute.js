import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import CrystalBruteBaseState from './state/CrystalBruteBaseState.js';
import CrystalBruteAttackState from './state/CrystalBruteAttackState.js';
import CrystalBruteDieState from './state/CrystalBruteDieState.js';
import CrystalBruteMoveState from './state/CrystalBruteMoveState.js';
import HealthBar from '../healthBar/HealthBar.js';
import CrystalBruteIdleState from './state/CrystalBruteIdleState.js';
export default class CrystalBrute extends Enemy {
    constructor(position, width, height, hitbox, maxHealth) {
        super(position, width, height, hitbox, maxHealth);
        this.speed = 3;
        this.attack = [];
        this.healthBar = HealthBar.generate({
            position: this.position,
            offset: {
                x: 5,
                y: 75,
            },
        });
        this.currState = new CrystalBruteBaseState();
        this.attackState = new CrystalBruteAttackState();
        this.moveState = new CrystalBruteMoveState();
        this.dieState = new CrystalBruteDieState();
        this.idleState = new CrystalBruteIdleState();
        this.switchState(this.idleState);
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }
    update() {
        this.knockback();
        const { debug, deltaTime } = Game.getInstance();
        if (debug) {
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
            this.damaged -= deltaTime;
        }
    }
    clear() {
        const { enemyList } = Game.getInstance().enemyManager;
        enemyList.splice(enemyList.indexOf(this), 1);
    }
}
