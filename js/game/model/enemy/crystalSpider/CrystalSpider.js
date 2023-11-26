import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import CrystalSpiderBaseState from './state/CrystalSpiderBaseState.js';
import CrystalSpiderMoveState from './state/CrystalSpiderMoveState.js';
import CrystalSpiderAttackState from './state/CrystalSpiderAttackState.js';
import CrystalSpiderDieState from './state/CrystalSpiderDieState.js';
import CrystalSpiderIdleState from './state/CrystalSpiderIdleState.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
import { Box } from '../../utility/interfaces/Box.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import Shadow from '../../shadow/Shadow.js';
export default class CrystalSpider extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.currState = new CrystalSpiderBaseState();
        this.attackState = new CrystalSpiderAttackState();
        this.moveState = new CrystalSpiderMoveState();
        this.dieState = new CrystalSpiderDieState();
        this.idleState = new CrystalSpiderIdleState();
        this._speed = RandomHelper.randomValue(2, 2);
        this._angle = Math.random() * 2 * Math.PI;
        this._attackSpeed = 0;
        this.shadow = new Shadow(1.5);
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
    get attackSpeed() {
        return this._attackSpeed;
    }
    set attackSpeed(value) {
        this._attackSpeed = value;
    }
    handleDamage(damage) {
        super.handleDamage(damage);
        if (this.health > 0) {
            AudioManager.playAudio('crystal_spider_hurt_audio').then();
        }
    }
    debugMode() {
        DrawHelper.setFillStyle('rgb(255, 255, 0, 0.5)');
        const { x, y, w, h } = this.hitbox.getPoints(this.position, this.width, this.height);
        DrawHelper.drawRectangle(new Box(x, y, w, h));
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }
    update() {
        if (Game.debug) {
            this.debugMode();
        }
        if (this.health <= 0 && this.currState !== this.dieState) {
            this.switchState(this.dieState);
        }
        this.currState.updateState(this);
        if (this.currState !== this.dieState) {
            this.shadow.renderShadow(new Vector(this.position.x, this.position.y));
        }
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
