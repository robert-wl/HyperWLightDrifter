import PlayerBaseState from './state/PlayerBaseState.js';
import PlayerIdleState from './state/PlayerIdleState.js';
import PlayerMoveState from './state/PlayerMoveState.js';
import PlayerAttackState from './state/PlayerAttackState.js';
import PlayerAttackTwoState from './state/PlayerAttackTwoState.js';
import { get_image } from '../../helper/fileReader.js';
import PlayerDashState from './state/PlayerDashState.js';
import Game from '../Game.js';
import collisionDetector from '../../helper/collisionDetector.js';

export default class Player {

    constructor() {
        this.health = 6;
        this.healthPack = 3;
        this.friction = 0.8;
        this.maxSpeed = 4;
        this.attackMoveSpeed = 16;
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
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 1000,
            height: 500,
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
        this.canvas = null;
        this.images = {};
        this.currState = this.idleState;
    }

    updateState() {
        this.renderShadow();
        this.updateCounter();
        this.currState.updateState(this);
        this.currState.drawImage(this);
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
        canvasCtx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    handleSwitchState({ move, attackOne, attackTwo, dash }) {
        if (Game.getInstance().clicks.includes('left') && attackOne) {
            return this.switchState(this.attackState);
        }
        if (this.combo && attackTwo) {
            return this.switchState(this.attackTwoState);
        }
        if (Game.getInstance().keys.includes('space') && dash) {
            return this.switchState(this.dashState);
        }
        if (['w', 'a', 's', 'd'].some(key => Game.getInstance().keys.includes(key)) && move) {
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
        const absVector = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y) * this.friction;
        this.direction.x = absVector * Math.cos(this.theta);
        this.direction.y = absVector * Math.sin(this.theta);

        const collideables = Game.getInstance().collideable;

        if(collideables.every(c => {
            return c.checkCollision({
                x: this.position.x + this.direction.x,
                y: this.position.y,
                w: this.width,
                h: this.height,
            });
        })) {
            this.position.x += this.direction.x;
        }
        if(collideables.every(c => {
            return c.checkCollision({
                x: this.position.x,
                y: this.position.y + this.direction.y,
                w: this.width,
                h: this.height,
            });
        })) {
            this.position.y += this.direction.y;
        }
        // this.position.x += collisionDetector({
        //     stage: Game.getInstance().stage,
        //     position: this.position,
        //     number: this.direction.x,
        //     type: "x",
        // });
        // this.position.y += collisionDetector({
        //     stage: Game.getInstance().stage,
        //     position: this.position,
        //     number: this.direction.y,
        //     type: "y",
        // });
    }

    renderShadow() {
        get_image('other', 'shadow', null, (img) => {
            this.canvas.drawImage(img, this.position.x - 24.5, this.position.y - 5, img.width * 1.5, img.height * 1.5);
        });
    }
}
