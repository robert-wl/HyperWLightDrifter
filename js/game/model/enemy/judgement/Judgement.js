import Enemy from '../Enemy.js';
import JudgementBaseState from './state/JudgementBaseState.js';
import JudgementSpawnState from './state/JudgementSpawnState.js';
import Game from '../../Game/Game.js';
import JudgementMoveState from './state/JudgementMoveState.js';
import JudgementAttackState from './state/JudgementAttackState.js';
import JudgementLaserState from './state/JudgementLaserState.js';
import JudgementDashState from './state/JudgementDashState.js';
import JudgementBombState from './state/JudgementBombState.js';

export default class Judgement extends Enemy {
    static generate({ x, y }) {
        Game.getInstance().boss = new Judgement({
            x,
            y,
            moveSpeed: 1,
            attackPosition: [
                {x: 500, y: 250},
                {x: 500, y: 750},
                {x: 1300, y: 250},
                {x: 1300, y: 750},
                {x: 900, y: 500},
            ],
        });
    }
    constructor({ x, y, moveSpeed, attackPosition }) {
        super({
            x,
            y,
            hitbox: {
                x: 30,
                y: 30,
                w: 10,
                h: 10,
            },
            w: 130,
            h: 179,
            health: 100,
            maxHealth: 100,
        });

        this.attackPosition = attackPosition;
        this.angle = 0;
        this.moveSpeed = moveSpeed;
        this.bombs = [];

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

    handleSwitchState({ move, dash, attack, laser }) {
        this.switchState(this.bombState);
        return;
        if (Math.random() < 0.6 && dash) {
            this.switchState(this.dashState);
        } else {
            if (Math.random() < 0.5 && attack && false) {
                this.switchState(this.attackState);
            } else if (laser) {
                this.switchState(this.laserState);
            }
        }
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);

        for (const bomb of this.bombs) {
            bomb.update();
        }

        // Game.getInstance().ctx.fillStyle = 'rgb(255, 255, 255, 0.1)';
        // Game.getInstance().ctx.fillRect(this.position.x, this.position.y, this.width * 2, this.height * 2);
    }
}
