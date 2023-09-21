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
import HealthBar from "../healthBar/HealthBar.js";
import AudioPlayer from "../../../../audio/AudioPlayer.js";

export default class Judgement extends Enemy {
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
    constructor({ x, y, moveSpeed, attackPosition, width, height }) {
        super({
            x,
            y,
            hitbox: {
                x: -width / 2,
                y: -height / 2,
                w: 0,
                h: 0,
            },
            w: width,
            h: height,
            health: 100,
            maxHealth: 100,
        });

        this.attackPosition = attackPosition;
        this.angle = 0;
        this.moveSpeed = moveSpeed;
        this.bombs = [];
        this.damaged = 0;
        this.currState = new JudgementBaseState();
        this.spawnState = new JudgementSpawnState();
        this.moveState = new JudgementMoveState();
        this.dashState = new JudgementDashState();
        this.attackState = new JudgementAttackState();
        this.laserState = new JudgementLaserState();
        this.bombState = new JudgementBombState();

        this.healthBar = HealthBar.generate({
            position: this.position,
            offset: { x: 5, y: 200 },
            maxHealth: this.maxHealth,
            HUD: Game.getInstance().HUD,
        })

        this.switchState(this.spawnState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    handleSwitchState({ dash, attack, laser, bomb }) {

        AudioPlayer.getInstance().playAudio("boss/scream.wav");
        if (Math.random() < 0.6 && dash) {
            this.switchState(this.dashState);
            return;
        } else {
            const random = getRandomValue({
                randomValue: 10,
            });
            if (random < 5 && attack) {
                this.switchState(this.attackState);
                return;
            } else if (random < 7 && laser) {
                this.switchState(this.laserState);
                return;
            } else if (bomb) {
                this.switchState(this.bombState);
                return;
            }
        }
        this.switchState(this.moveState);
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);

        this.bombs.forEach((bomb) => bomb.update());

        if (Game.getInstance().debug) {
            this.debugMode();
        }

        this.drawHealthbar();

        if(this.damaged >= 0) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
        this.currState.drawImage(this);
        if(this.damaged >= 0) {
            Game.getInstance().setFilter('none');
            this.damaged -= 1;
        }
    }

    drawHealthbar() {

        this.healthBar.update({
            health: this.health,
            position: {
                x: this.position.x,
                y: this.position.y,
            }
        });

    }

    // debugMode() {
    //     const ctx = Game.getInstance().ctx;
    //     ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';
    //     ctx.fillRect(
    //         this.centerPosition.x + this.hitbox.x,
    //         this.centerPosition.y + this.hitbox.y,
    //         this.width - this.hitbox.w,
    //         this.height - this.hitbox.h
    //     );
    // }
}
