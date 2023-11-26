import Enemy from '../Enemy.js';
import Game from '../../game/Game.js';
import CrystalBruteBaseState from './state/CrystalBruteBaseState.js';
import CrystalBruteAttackState from './state/CrystalBruteAttackState.js';
import CrystalBruteDieState from './state/CrystalBruteDieState.js';
import CrystalBruteMoveState from './state/CrystalBruteMoveState.js';
import HealthBar from '../healthBar/HealthBar.js';
import CrystalBruteIdleState from './state/CrystalBruteIdleState.js';
import HitBoxComponent from '../../utility/HitBoxComponent.js';
import CrystalAttack from './CrystalAttack.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import Observable from '../../utility/Observable.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import Shadow from '../../shadow/Shadow.js';
import GameSettings from '../../../constants.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';

export default class CrystalBrute extends Enemy {
    public attack: CrystalAttack[];
    public healthBar: HealthBar;
    public currState: CrystalBruteBaseState;
    public attackState: CrystalBruteAttackState;
    public moveState: CrystalBruteMoveState;
    public dieState: CrystalBruteDieState;
    public idleState: CrystalBruteIdleState;
    private _speed: number;
    private _angle: number;
    private shadow: Shadow;

    constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, enemyObserver: Observable, attackObserver: Observable) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this._speed = GameSettings.GAME.ENEMY.CRYSTAL_BRUTE.SPEED;
        this._angle = 0;
        this.attack = [];

        const offset = new Vector(5, 75);
        this.healthBar = new HealthBar(offset, this.maxHealth);
        this.currState = new CrystalBruteBaseState();
        this.attackState = new CrystalBruteAttackState();
        this.moveState = new CrystalBruteMoveState();
        this.dieState = new CrystalBruteDieState();
        this.idleState = new CrystalBruteIdleState();
        this.shadow = new Shadow(3);
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

    handleDamage(damage: PolarVector) {
        super.handleDamage(damage);
        if (this.health > 0) {
            AudioManager.playAudio('crystal_brute_hurt_audio').then();
        }
    }

    switchState(newState: CrystalBruteBaseState) {
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
            this.shadow.renderShadow(new Vector(this.position.x, this.position.y + 27.5));
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
