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
import AudioPlayer from '../../../../audio/AudioPlayer.js';
import JudgementDeathState from './state/JudgementDeathState.js';
import { getManhattanDistance } from '../../../helper/distanceHelper.js';
import { getRandomBoolean } from '../../../helper/randomHelper.js';
import GameSettings from '../../../constants.js';
export default class Judgement extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this._angle = 0;
        this.damaged = 0;
        this.attackPosition = GameSettings.GAME.ENEMY.JUDGEMENT.ATTACK_POSITION;
        this.moveSpeed = GameSettings.GAME.ENEMY.JUDGEMENT.MOVE_SPEED;
        this.currState = new JudgementBaseState();
        this.spawnState = new JudgementSpawnState();
        this.moveState = new JudgementMoveState();
        this.dashState = new JudgementDashState();
        this.attackState = new JudgementAttackState();
        this.laserState = new JudgementLaserState();
        this.bombState = new JudgementBombState();
        this.deathState = new JudgementDeathState();
        this.healthBar = HealthBar.generate({
            position: {
                x: 0,
                y: 0,
            },
            offset: {
                x: 130,
                y: 500,
            },
            maxHealth: this.maxHealth,
            HUD: Game.getInstance().HUD,
        });
        this.switchState(this.spawnState);
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
    isDead() {
        return this.currState === this.deathState;
    }
    handleSwitchState() {
        AudioPlayer.getInstance().playAudio('boss/scream.wav');
        const { dashChance, attackChance, laserChance, bombChance } = this.getStateProbability();
        if (getRandomBoolean(dashChance)) {
            this.switchState(this.dashState);
            return;
        }
        if (getRandomBoolean(attackChance)) {
            this.switchState(this.attackState);
            return;
        }
        if (getRandomBoolean(laserChance)) {
            this.switchState(this.laserState);
            return;
        }
        if (getRandomBoolean(bombChance)) {
            this.switchState(this.bombState);
            return;
        }
        this.switchState(this.moveState);
    }
    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
        const { debug, deltaTime } = Game.getInstance();
        if (debug) {
            this.debugMode();
        }
        this.drawHealthbar();
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
        this.currState.drawImage(this);
        if (this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= deltaTime;
        }
    }
    handleDamage({ amount, angle = 0 }) {
        if (this.currState === this.bombState) {
            return;
        }
        if (this.currState === this.dashState) {
            return;
        }
        if (this.currState === this.deathState) {
            return;
        }
        if (this.currState === this.spawnState) {
            return;
        }
        const { player } = Game.getInstance();
        if (this.health <= 0 && (player.currState === player.attackState || player.currState === player.attackTwoState)) {
            this.switchState(this.deathState);
        }
        super.handleDamage({ amount, angle });
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
        const distance = getManhattanDistance({
            x: this.position.x - player.centerPosition.x,
            y: this.position.y - player.centerPosition.y,
        });
        if (distance < 400) {
            dashChance = 0.25;
            attackChance = 0.35;
            laserChance = 0.05;
            bombChance = 0.35;
        }
        else if (distance < 750) {
            dashChance = 0.25;
            attackChance = 0.35;
            laserChance = 0.15;
            bombChance = 0.35;
        }
        else {
            dashChance = 0.25;
            attackChance = 0.05;
            laserChance = 0.35;
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
