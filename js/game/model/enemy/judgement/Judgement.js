import Enemy from '../Enemy.js';
import JudgementBaseState from './state/JudgementBaseState.js';
import JudgementSpawnState from './state/JudgementSpawnState.js';
import Game from '../../Game/Game.js';
import JudgementMoveState from './state/JudgementMoveState.js';
import JudgementAttackState from './state/JudgementAttackState.js';
import JudgementLaserState from './state/JudgementLaserState.js';
import JudgementDashState from './state/JudgementDashState.js';
import JudgementBombState from './state/JudgementBombState.js';
import { getRandomValue } from '../../../helper/randomHelper.js';
import HealthBar from '../healthBar/HealthBar.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';
import JudgementDeathState from './state/JudgementDeathState.js';

export default class Judgement extends Enemy {
    constructor({ x, y, moveSpeed, attackPosition, width, height }) {
        super({
            x,
            y,
            hitbox: {
                x: -width / 2 + 50,
                y: -height / 2 + 75,
                w: 125,
                h: 100,
            },
            w: width,
            h: height,
            health: 100,
            maxHealth: 100,
        });

        this.attackPosition = attackPosition;
        this.angle = 0;
        this.moveSpeed = moveSpeed;
        this.damaged = 0;
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

    static generate({ x, y }) {
        const { enemyManager } = Game.getInstance();
        enemyManager.boss = new Judgement({
            x,
            y,
            moveSpeed: 1,
            attackPosition: [
                { x: 700, y: 550 },
                { x: 700, y: 1050 },
                { x: 1500, y: 550 },
                { x: 1500, y: 1050 },
                { x: 1100, y: 800 },
            ],
            width: 130 * 2,
            height: 179 * 2,
        });
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    handleSwitchState() {
        AudioPlayer.getInstance().playAudio('boss/scream.wav');

        const random = getRandomValue({
            randomValue: 10,
        });

        if (this.currState === this.dashState) {
            if (random < 5) {
                this.switchState(this.attackState);
                return;
            }
            if (random < 8) {
                this.switchState(this.laserState);
                return;
            }
            this.switchState(this.bombState);
            return;
        }

        if (this.currState === this.moveState) {
            if (random < 4) {
                this.switchState(this.dashState);
                return;
            }
            if (random < 6) {
                this.switchState(this.attackState);
                return;
            }
            if (random < 8) {
                this.switchState(this.laserState);
                return;
            }
            this.switchState(this.bombState);
            return;
        }

        if (random <= 5) {
            this.switchState(this.dashState);
            return;
        }
        this.switchState(this.moveState);
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);

        if (Game.getInstance().debug) {
            this.debugMode();
        }

        this.drawHealthbar();

        if (this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }

        this.currState.drawImage(this);

        if (this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= 1;
        }
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

    damage({ amount, angle }) {
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

        return super.damage({ amount, angle });
    }

    debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';
        ctx.fillRect(this.position.x + this.hitbox.x, this.position.y + this.hitbox.y, this.width - this.hitbox.w, this.height - this.hitbox.h);
    }
}
