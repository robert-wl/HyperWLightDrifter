import PlayerBaseState from './state/PlayerBaseState.js';
import PlayerIdleState from './state/PlayerIdleState.js';
import PlayerMoveState from './state/PlayerMoveState.js';
import PlayerAttackState from './state/PlayerAttackState.js';
import PlayerAttackTwoState from './state/PlayerAttackTwoState.js';
import PlayerDashState from './state/PlayerDashState.js';
import Game from '../Game/Game.js';
import renderShadow from '../../helper/renderer/shadow.js';
import PlayerAimingState from './state/PlayerAimingState.js';
import PlayerHurtState from './state/PlayerHurtState.js';
import playerEffectsHandler from './playerEffectsHandler.js';
import PlayerThrowingState from './state/PlayerThrowingState.js';
import GameSettings from '../../constants.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { checkCollision } from '../../helper/collision/playerCollision.js';


export default class Player {
    constructor() {
        const { player: playerDefault } = GameSettings;
        this.maxhealth = playerDefault.MAX_HEALTH;
        this.health = playerDefault.MAX_HEALTH;
        this.healthPack = playerDefault.MAX_HEALTHPACKS;
        this.stamina = playerDefault.MAX_STAMINA;
        this.bombs = playerDefault.MAX_BOMBS;
        this.bullets = playerDefault.MAX_BULLETS;
        this.friction = playerDefault.FRICTION;
        this.maxSpeed = playerDefault.MAX_SPEED;
        this.attackMoveSpeed = playerDefault.ATTACK_MOVE_SPEED;
        this.dashMoveSpeed = playerDefault.DASH_MOVE_SPEED;
        this.direction = {
            x: 0,
            y: 0,
        };
        this.theta = 0;
        this.lookAngle = 0;
        this.position = playerDefault.START_POSITION;
        this.width = playerDefault.WIDTH;
        this.height = playerDefault.HEIGHT;
        this.hitbox = playerDefault.HITBOX;
        this.attackBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        this.centerPosition = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        };
        this.lastDirection = playerDefault.LAST_DIRECTION;
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
        this.throwState = new PlayerThrowingState();
        this.canvas = null;
        this.healing = 0;
        this.currState = this.idleState;
        this.immunity = playerDefault.MAX_IMMUNITY;
        this.projectiles = [];
        this.playerDefault = playerDefault;
    }

    updateState() {

        this.updateBombs();

        renderShadow({
            position: {
                x: this.position.x + this.playerDefault.SHADOW_OFFSET.X,
                y: this.position.y + this.playerDefault.SHADOW_OFFSET.Y,
            },
            sizeMultiplier: 1.5,
        });

        this.updateCounter();

        this.currState.updateState(this);

        playerEffectsHandler({
            currPlayer: this,
        });

        this.currState.drawImage(this);

        playerEffectsHandler({
            currPlayer: this,
            clear: true,
        });

        this.projectiles.forEach((projectile) => projectile.update());

        this.moveHandler();

        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    updateBombs() {
        if (this.bombs > 2) {
            return;
        }
        this.bombs += 0.001;
    }

    updateCounter() {
        this.counter = (this.counter + 1) % 7;
    }

    getHitboxCoordinates() {
        return {
            x: this.position.x + this.hitbox.x,
            y: this.position.y + this.hitbox.y,
            w: this.width - this.hitbox.w,
            h: this.height - this.hitbox.h,
        };
    }

    renderDebugBox() {
        Game.getInstance().ctx.fillStyle = this.playerDefault.DEBUG_COLOR;

        const { x, y, w, h } = this.getHitboxCoordinates();

        Game.getInstance().ctx.fillRect(x, y, w, h);
    }

    damage({ angle }) {
        this.immunity = 0;
        this.health -= 1;

        if (this.currState !== this.hurtState) {
            this.switchState(this.hurtState);
        }

        this.direction.x += getHorizontalValue({
            magnitude: 5,
            angle: angle + Math.PI,
        });
        this.direction.y += getVerticalValue({
            magnitude: 5,
            angle: angle + Math.PI,
        });
    }

    handleSwitchState({ move, attackOne, attackTwo, dash, aim, throws }) {
        const { clicks, keys } = Game.getInstance();

        if (clicks.includes('right') && aim) {
            return this.switchState(this.aimState);
        }
        if (keys.includes('c') && throws && this.bombs >= 1) {
            this.bombs--;
            return this.switchState(this.throwState);
        }
        if (clicks.includes('left') && attackOne) {
            return this.switchState(this.attackState);
        }
        if (this.combo && attackTwo) {
            return this.switchState(this.attackTwoState);
        }
        if (keys.includes('space') && dash && this.stamina >= 10) {
            return this.switchState(this.dashState);
        }
        if (['w', 'a', 's', 'd'].some((key) => keys.includes(key)) && move) {
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

        const absVector =
            getMagnitudeValue({
                x: this.direction.x,
                y: this.direction.y,
            }) * this.friction;

        this.direction.x = getHorizontalValue({
            magnitude: absVector,
            angle: this.theta,
        });

        this.direction.y = getVerticalValue({
            magnitude: absVector,
            angle: this.theta,
        });

        const { collideables } = Game.getInstance();

        if (
            checkCollision({
                collideables,
                x: this.position.x + this.direction.x,
                y: this.position.y,
                w: this.width,
                h: this.height,
            })
        ) {
            this.position.x += this.direction.x;
            this.centerPosition.x += this.direction.x;
        }
        if (
            checkCollision({
                collideables,
                x: this.position.x + this.direction.x,
                y: this.position.y,
                w: this.width,
                h: this.height,
            })
        ) {
            this.position.y += this.direction.y;
            this.centerPosition.y += this.direction.y;
        }
    }

    getAttackBox({ direction }) {
        if (direction === 'w') {
            this.attackBox = {
                x: this.position.x + this.playerDefault.ATTACK_BOX.up.x,
                y: this.position.y + this.playerDefault.ATTACK_BOX.up.y,
                w: this.playerDefault.ATTACK_BOX.up.w,
                h: this.playerDefault.ATTACK_BOX.up.h,
            };
        }
        if (direction === 'a') {
            this.attackBox = {
                x: this.position.x + this.playerDefault.ATTACK_BOX.left.x,
                y: this.position.y + this.playerDefault.ATTACK_BOX.left.y,
                w: this.playerDefault.ATTACK_BOX.left.w,
                h: this.playerDefault.ATTACK_BOX.left.h,
            };
        }
        if (direction === 'd') {
            this.attackBox = {
                x: this.position.x + this.playerDefault.ATTACK_BOX.right.x,
                y: this.position.y + this.playerDefault.ATTACK_BOX.right.y,
                w: this.playerDefault.ATTACK_BOX.right.w,
                h: this.playerDefault.ATTACK_BOX.right.h,
            };
        }
        if (direction === 's') {
            this.attackBox = {
                x: this.position.x + this.playerDefault.ATTACK_BOX.down.x,
                y: this.position.y + this.playerDefault.ATTACK_BOX.down.y,
                w: this.playerDefault.ATTACK_BOX.down.w,
                h: this.playerDefault.ATTACK_BOX.down.h,
            };
        }
    }

    getCenterPosition(){
        return {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
        };
    }
}
