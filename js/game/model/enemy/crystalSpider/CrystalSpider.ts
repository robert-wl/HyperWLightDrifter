import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import CrystalSpiderBaseState from './state/CrystalSpiderBaseState.js';
import CrystalSpiderMoveState from './state/CrystalSpiderMoveState.js';
import CrystalSpiderAttackState from './state/CrystalSpiderAttackState.js';
import CrystalSpiderDieState from './state/CrystalSpiderDieState.js';
import renderShadow from '../../../helper/renderer/shadow.js';
import { getRandomValue } from '../../../helper/randomHelper.js';
import CrystalSpiderIdleState from './state/CrystalSpiderIdleState.js';
import HitBoxComponent from '../../utility/HitBoxComponent';
import { Vector } from '../../utility/enums/Vector.js';
import Observable from '../../utility/Observable';

export default class CrystalSpider extends Enemy {
    public currState: CrystalSpiderBaseState;
    public attackState: CrystalSpiderAttackState;
    public moveState: CrystalSpiderMoveState;
    public dieState: CrystalSpiderDieState;
    public idleState: CrystalSpiderIdleState;
    private _speed: number;
    private _angle: number;
    private _attackSpeed: number;

    constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, attackObserver: Observable) {
        super(position, width, height, hitbox, maxHealth, attackObserver);
        this.currState = new CrystalSpiderBaseState();
        this.attackState = new CrystalSpiderAttackState();
        this.moveState = new CrystalSpiderMoveState();
        this.dieState = new CrystalSpiderDieState();
        this.idleState = new CrystalSpiderIdleState();
        this._speed = getRandomValue({
            initialValue: 2,
            randomValue: 2,
        });
        this._angle = Math.random() * 2 * Math.PI;
        this._attackSpeed = 0;
        this.switchState(this.idleState);
    }

    get speed(): number {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

    get angle(): number {
        return this._angle;
    }

    set angle(value: number) {
        this._angle = value;
    }

    get attackSpeed(): number {
        return this._attackSpeed;
    }

    set attackSpeed(value: number) {
        this._attackSpeed = value;
    }

    static generate({ x, y }) {
        // const newCrystalSpider = new CrystalSpider({
        //     x,
        //     y,
        // });
        //
        // const { enemyList } = Game.getInstance().enemyManager;
        // enemyList.push(newCrystalSpider);
    }

    debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';

        const { x, y, w, h } = this.hitbox.getPoints(this.position, this.width, this.height);

        ctx.fillRect(x, y, w, h);
    }

    switchState(newState: CrystalSpiderBaseState) {
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
