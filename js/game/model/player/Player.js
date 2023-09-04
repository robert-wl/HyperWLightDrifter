import PlayerBaseState from './state/PlayerBaseState.js';
import PlayerIdleState from './state/PlayerIdleState.js';
import PlayerMoveState from './state/PlayerMoveState.js';
import PlayerAttackState from './state/PlayerAttackState.js';
import PlayerAttackTwoState from './state/PlayerAttackTwoState.js';
import PlayerDashState from './state/PlayerDashState.js';
import Game from '../Game.js';
import renderShadow from '../../helper/renderer/shadow.js';
import PlayerAimingState from './state/PlayerAimingState.js';
import PlayerHurtState from './state/PlayerHurtState.js';

export const playerOffset = {
    x: 30,
    y: 50,
};

export default class Player {
    constructor() {
        this.maxhealth = 6;
        this.health = 1;
        this.healthPack = 3;
        this.stamina = 100;
        this.bombs = 2;
        this.bullets = 3;
        this.friction = 0.8;
        this.maxSpeed = 4;
        this.attackMoveSpeed = 4;
        this.dashMoveSpeed = 16;
        this.direction = {
            x: 0,
            y: 1,
        };
        this.theta = 0;
        this.lookAngle = 0;
        this.position = {
            x: 200,
            y: 200,
        };
        this.width = 50;
        this.height = 60;
        this.hitbox = {
            x: 15,
            y: 0,
            w: 15,
            h: 0,
        };
        this.attackBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        this.lastDirection = 's';
        this.combo = false;
        this.reversed = false;
        this.counter = 0;
        this.currState = new PlayerBaseState();
        this.idleState = new PlayerIdleState();
        this.moveState = new PlayerMoveState();
        this.attackState = new PlayerAttackState();
        this.dashState = new PlayerDashState();
        this.attackTwoState = new PlayerAttackTwoState();
        this.aimState = new PlayerAimingState();
        this.hurtState = new PlayerHurtState();
        this.canvas = null;
        this.healing = 0;
        this.currState = this.idleState;
        this.immunity = 30;
        this.projectiles = [];
    }

    updateState() {
        if (this.immunity < 30) {
            this.immunity++;
        }
        renderShadow({
            position: {
                x: this.position.x - 24.5,
                y: this.position.y - 5,
            },
            sizeMultiplier: 1.5,
        });
        this.updateCounter();
        this.currState.updateState(this);

        const ctx = Game.getInstance().canvasCtx;
        if (this.immunity <= 5) {
            ctx.filter = 'sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)';
        }
        else if(this.healing > 0){
            ctx.filter = 'sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%)';
            ctx.strokeStyle = 'rgb(0, 255, 0)';
            ctx.lineWidth = (this.healing / 3) * 3;
            ctx.save();
            ctx.translate(this.position.x + 15, this.position.y + 30);
            ctx.rotate(Math.PI / 4);
            // ctx.translate((this.width - this.hitbox.x) / 2, (this.width - this.hitbox.x) / 2);
            ctx.strokeRect(
                10,
                -15,
                this.width - this.hitbox.x,
                this.width - this.hitbox.x,
            );
            ctx.restore();
            if(this.health < this.maxhealth) {
                this.health += 1;
            }
            this.healing--;
        }
        this.currState.drawImage(this);
        if (this.immunity <= 5 || this.healing >= 0) {
            ctx.filter = 'none';
        }
        for (const projectile of this.projectiles) {
            projectile.update();
        }
        this.moveHandler();
        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    updateCounter() {
        this.counter += 1;
        this.counter %= 7;
    }
    renderDebugBox() {
        const canvasCtx = Game.getInstance().canvasCtx;
        canvasCtx.fillStyle = 'rgb(0, 255, 0, 0.5)';
        canvasCtx.fillRect(this.position.x + this.hitbox.x, this.position.y + this.hitbox.y, this.width - this.hitbox.w, this.height - this.hitbox.h);
    }

    damage({ angle }) {
        this.immunity = 0;
        this.health -= 1;
        if (this.currState !== this.hurtState) {
            this.switchState(this.hurtState);
        }

        this.direction.x += 5 * Math.cos(angle + Math.PI);
        this.direction.y += 5 * Math.sin(angle + Math.PI);
    }

    handleSwitchState({ move, attackOne, attackTwo, dash, aim }) {
        if (Game.getInstance().clicks.includes('right') && aim) {
            return this.switchState(this.aimState);
        }
        if (Game.getInstance().clicks.includes('left') && attackOne) {
            return this.switchState(this.attackState);
        }
        if (this.combo && attackTwo) {
            return this.switchState(this.attackTwoState);
        }
        if (Game.getInstance().keys.includes('space') && dash && this.stamina >= 10) {
            return this.switchState(this.dashState);
        }
        if (['w', 'a', 's', 'd'].some((key) => Game.getInstance().keys.includes(key)) && move) {
            return this.switchState(this.moveState);
        }
        return this.switchState(this.idleState);
    }

    switchState(newState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }
    moveHandler() {
        this.theta = Math.atan2(this.direction.y, this.direction.x);
        const absVector = Math.sqrt(
            this.direction.x * this.direction.x +
            this.direction.y * this.direction.y
        ) * this.friction;
        this.direction.x = absVector * Math.cos(this.theta);
        this.direction.y = absVector * Math.sin(this.theta);

        const collideables = Game.getInstance().collideable;

        if (
            collideables.every((c) => {
                return c.checkCollision({
                    x: this.position.x + this.direction.x,
                    y: this.position.y,
                    w: this.width,
                    h: this.height,
                });
            })
        ) {
            this.position.x += this.direction.x;
        }
        if (
            collideables.every((c) => {
                return c.checkCollision({
                    x: this.position.x,
                    y: this.position.y + this.direction.y,
                    w: this.width,
                    h: this.height,
                });
            })
        ) {
            this.position.y += this.direction.y;
        }
    }

    getHitbox({ direction }) {
        if (direction === 'w') {
            this.attackBox = {
                x: this.position.x - 20,
                y: this.position.y - 30,
                w: 100,
                h: 75,
            };
        }
        if (direction === 'a') {
            this.attackBox = {
                x: this.position.x - 50,
                y: this.position.y - 10,
                w: 100,
                h: 85,
            };
        }
        if (direction === 'd') {
            this.attackBox = {
                x: this.position.x,
                y: this.position.y - 10,
                w: 110,
                h: 85,
            };
        }
        if (direction === 's') {
            this.attackBox = {
                x: this.position.x - 25,
                y: this.position.y + 10,
                w: 100,
                h: 100,
            };
        }
    }
}
