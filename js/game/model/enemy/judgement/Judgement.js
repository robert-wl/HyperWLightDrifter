import Enemy from '../Enemy.js';
import JudgementBaseState from './state/JudgementBaseState.js';
import JudgementSpawnState from './state/JudgementSpawnState.js';
import Game from '../../Game/Game.js';
import JudgementMoveState from './state/JudgementMoveState.js';
import JudgementAttackState from './state/JudgementAttackState.js';
import JudgementLaserState from './state/JudgementLaserState.js';
import JudgementDashState from './state/JudgementDashState.js';
import JudgementBombState from './state/JudgementBombState.js';
import {randomizeValue} from "../../../helper/randomHelper.js";

export default class Judgement extends Enemy {
    static generate({ x, y }) {
        Game.getInstance().boss = new Judgement({
            x,
            y,
            moveSpeed: 1,
            attackPosition: [
                {x: 700, y: 550},
                {x: 700, y: 1050},
                {x: 1500, y: 550},
                {x: 1500, y: 1050},
                {x: 1100, y: 800},
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
        this.centerPosition = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        }
        this.position = this.centerPosition;
        this.currState = new JudgementBaseState();
        this.spawnState = new JudgementSpawnState();
        this.moveState = new JudgementMoveState();
        this.dashState = new JudgementDashState();
        this.attackState = new JudgementAttackState();
        this.laserState = new JudgementLaserState();
        this.bombState = new JudgementBombState();

        this.switchState(this.spawnState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    handleSwitchState({ move, dash, attack, laser, bomb }) {
        if (Math.random() < 0.6 && dash) {
            this.switchState(this.dashState);
        } else {
            const random = randomizeValue({
                randomValue: 3
            });
            if (random < 1 && attack) {
                this.switchState(this.attackState);
            } else if (random < 2 && laser) {
                this.switchState(this.laserState);
            } else if (bomb) {
                this.switchState(this.bombState);
            }
        }
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);

        this.bombs.forEach((bomb) => bomb.update());

        if(Game.getInstance().debug) {
            this.debugMode();
        }
        // Game.getInstance().ctx.fillStyle = 'rgb(255, 255, 255, 0.1)';
        // Game.getInstance().ctx.fillRect(this.position.x, this.position.y, this.width * 2, this.height * 2);
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
