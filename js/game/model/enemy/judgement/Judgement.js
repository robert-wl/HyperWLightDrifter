import Enemy from '../Enemy.js';
import JudgementBaseState from './state/JudgementBaseState.js';
import JudgementSpawnState from './state/JudgementSpawnState.js';
import Game from '../../game/Game.js';
import JudgementMoveState from './state/JudgementMoveState.js';
import JudgementAttackState from './state/JudgementAttackState.js';
import JudgementLaserState from './state/JudgementLaserState.js';
import JudgementDashState from './state/JudgementDashState.js';
import JudgementBombState from './state/JudgementBombState.js';
import HealthBar from '../healthBar/HealthBar.js';
import JudgementDeathState from './state/JudgementDeathState.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import GameSettings from '../../../constants.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
export default class Judgement extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this._angle = 0;
        this.damaged = 0;
        this._attackPosition = GameSettings.GAME.ENEMY.JUDGEMENT.ATTACK_POSITION;
        this._moveSpeed = GameSettings.GAME.ENEMY.JUDGEMENT.MOVE_SPEED;
        this.currState = new JudgementBaseState();
        this.lastState = new JudgementBaseState();
        this.spawnState = new JudgementSpawnState();
        this.moveState = new JudgementMoveState();
        this.dashState = new JudgementDashState();
        this.attackState = new JudgementAttackState();
        this.laserState = new JudgementLaserState();
        this.bombState = new JudgementBombState();
        this.dieState = new JudgementDeathState();
        this.healthBar = new HealthBar(new Vector(130, 500), this.maxHealth, Game.getInstance().HUD);
        this.switchState(this.spawnState);
    }
    get moveSpeed() {
        return this._moveSpeed;
    }
    set moveSpeed(value) {
        this._moveSpeed = value;
    }
    get attackPosition() {
        return this._attackPosition;
    }
    set attackPosition(value) {
        this._attackPosition = value;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    switchState(newState) {
        this.currState.exitState(this);
        this.lastState = this.currState;
        this.currState = newState;
        this.currState.enterState(this);
    }
    isDead() {
        return this.currState === this.dieState;
    }
    handleSwitchState() {
        AudioManager.playAudio('judgement_scream_audio');
        const { dashChance, attackChance, laserChance, bombChance } = this.getStateProbability();
        if (RandomHelper.getRandomBoolean(dashChance) && this.lastState !== this.dashState) {
            this.switchState(this.dashState);
            return;
        }
        if (RandomHelper.getRandomBoolean(attackChance) && this.lastState !== this.attackState) {
            this.switchState(this.attackState);
            return;
        }
        if (RandomHelper.getRandomBoolean(laserChance) && this.lastState !== this.laserState) {
            this.switchState(this.laserState);
            return;
        }
        if (RandomHelper.getRandomBoolean(bombChance) && this.lastState !== this.bombState) {
            this.switchState(this.bombState);
            return;
        }
        this.switchState(this.moveState);
    }
    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
        if (Game.debug) {
            this.debugMode();
        }
        this.drawHealthbar();
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
        this.currState.drawImage(this);
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= Game.deltaTime;
        }
    }
    handleDamage({ amount, angle = 0 }) {
        if (this.currState === this.bombState) {
            return;
        }
        if (this.currState === this.dashState) {
            return;
        }
        if (this.currState === this.dieState) {
            return;
        }
        if (this.currState === this.spawnState) {
            return;
        }
        const { player } = Game.getInstance();
        if (this.health <= 0 && (player.currState === player.attackState || player.currState === player.attackTwoState)) {
            this.switchState(this.dieState);
        }
        super.handleDamage({ amount, angle });
        if (RandomHelper.getRandomBoolean(0.3)) {
            AudioManager.playAudio('judgement_hurt_audio');
        }
        return;
    }
    debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';
        ctx.fillRect(this.position.x + this.hitbox.xOffset, this.position.y + this.hitbox.yOffset, this.width - this.hitbox.wOffset, this.height - this.hitbox.hOffset);
    }
    getStateProbability() {
        let dashChance;
        let attackChance;
        let laserChance;
        let bombChance;
        const { player } = Game.getInstance();
        const distance = DistanceHelper.getManhattanDistance({
            x: this.position.x - player.centerPosition.x,
            y: this.position.y - player.centerPosition.y,
        });
        if (distance < 400) {
            dashChance = 0.15;
            attackChance = 0.45;
            laserChance = 0.05;
            bombChance = 0.35;
        }
        else if (distance < 750) {
            dashChance = 0.1;
            attackChance = 0.45;
            laserChance = 0.1;
            bombChance = 0.45;
        }
        else {
            dashChance = 0.15;
            attackChance = 0.05;
            laserChance = 0.45;
            bombChance = 0.35;
        }
        return { dashChance, attackChance, laserChance, bombChance };
    }
    drawHealthbar() {
        this.healthBar.update({
            health: this.health,
            position: {
                x: 0,
                y: 0,
            },
            bypass: true,
        });
    }
}
