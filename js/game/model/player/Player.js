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
import playerEffectsHandler from '../../helper/player/playerEffectsHelper.js';
import PlayerThrowingState from './state/PlayerThrowingState.js';
import GameSettings from '../../constants.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { checkCollision } from '../../helper/collision/playerCollision.js';
import PlayerSpawnState from './state/PlayerSpawnState.js';
import PlayerDeathState from './state/PlayerDeathState.js';
import PlayerInElevatorState from './state/PlayerInElevatorState.js';

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
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.theta = 0;
        this.lookAngle = 0;
        this.width = playerDefault.WIDTH;
        this.height = playerDefault.HEIGHT;
        this.hitbox = {
            x: -this.width / 2 + 10,
            y: -this.height / 2 + 5,
            w: 20,
            h: 10,
        };
        this.attackBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        this.centerPosition = {
            x: playerDefault.START_POSITION.x + this.width / 2,
            y: playerDefault.START_POSITION.y + this.height / 2,
        };
        this.lastDirection = playerDefault.LAST_DIRECTION;
        this.combo = false;
        this.counter = 0;
        this.currState = new PlayerBaseState();
        this.spawnState = new PlayerSpawnState();
        this.idleState = new PlayerIdleState();
        this.moveState = new PlayerMoveState();
        this.attackState = new PlayerAttackState();
        this.dashState = new PlayerDashState();
        this.attackTwoState = new PlayerAttackTwoState();
        this.aimState = new PlayerAimingState();
        this.hurtState = new PlayerHurtState();
        this.throwState = new PlayerThrowingState();
        this.deathState = new PlayerDeathState();
        this.inElevatorState = new PlayerInElevatorState();
        this.canvas = null;
        this.healing = 0;
        this.immunity = playerDefault.MAX_IMMUNITY;
        this.projectiles = [];
        this.playerDefault = playerDefault;
        this.outfit = 'default';
    }

    updateState(colliders) {
        if (this.health <= 0 && this.currState !== this.deathState) {
            this.switchState(this.deathState);
        }

        this.updateBombs();

        if (this.currState !== this.spawnState) {
            renderShadow({
                position: {
                    x: this.centerPosition.x,
                    y: this.centerPosition.y + 12.5,
                },
                sizeMultiplier: 1.5,
            });
        }

        this.updateCounter();

        this.currState.updateState(this);

        if (this.currState !== this.deathState) {
            playerEffectsHandler({
                currPlayer: this,
            });
        }

        this.moveHandler(colliders);

        this.currState.drawImage(this);

        playerEffectsHandler({
            currPlayer: this,
            clear: true,
        });

        this.projectiles.forEach((projectile) => projectile.update());

        this.heal();
        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    updateBombs() {
        if (this.bombs > 2) {
            return;
        }

        const { deltaTime } = Game.getInstance();
        this.bombs += 0.001 * deltaTime;
    }

    updateCounter() {
        const { deltaTime } = Game.getInstance();
        if (this.counter >= 1) {
            this.counter = 0;
        }

        this.counter += deltaTime;
    }

    heal() {
        const { keys } = Game.getInstance();

        if (!keys.includes('q')) {
            return;
        }

        keys.splice(keys.indexOf('q'), 1);

        if (this.healthPack <= 0) {
            return;
        }

        this.healthPack -= 1;
        this.health += 5;
        this.healing = 6;
    }

    getHitboxCoordinates() {
        return {
            x: this.centerPosition.x + this.hitbox.x,
            y: this.centerPosition.y + this.hitbox.y,
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
        if (this.currState === this.deathState) {
            return;
        }

        if (this.immunity < 50 || this.currState === this.dashState) {
            return;
        }

        this.immunity = 0;
        this.health -= 1;

        if (this.currState !== this.hurtState) {
            this.switchState(this.hurtState);
        }

        const { movementDeltaTime } = Game.getInstance();
        this.velocity.x += getHorizontalValue({
            magnitude: 5 * movementDeltaTime,
            angle: angle + Math.PI,
        });
        this.velocity.y += getVerticalValue({
            magnitude: 5 * movementDeltaTime,
            angle: angle + Math.PI,
        });
    }

    regenerateStamina() {
        const { deltaTime } = Game.getInstance();
        if (this.stamina < 100) {
            this.stamina += 0.5 * deltaTime;
        }
    }

    handleSwitchState({ move, attackOne, attackTwo, dash, aim, throws }) {
        const { clicks, keys } = Game.getInstance();

        if (clicks.includes('right') && aim) {
            return this.switchState(this.aimState);
        }
        if (keys.includes('c') && throws && this.bombs >= 1) {
            this.bombs -= 1;
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

    moveHandler(colliders) {
        this.theta = Math.atan2(this.velocity.y, this.velocity.x);

        const { movementDeltaTime } = Game.getInstance();

        this.velocity.x = this.velocity.x * (1 - this.friction * movementDeltaTime);
        this.velocity.y = this.velocity.y * (1 - this.friction * movementDeltaTime);

        let { x, y, w, h } = this.getHitboxCoordinates();

        if (
            checkCollision({
                colliders,
                x: x + this.velocity.x,
                y: y,
                w: w,
                h: h,
            })
        ) {
            this.centerPosition.x += this.velocity.x;
        }

        if (
            checkCollision({
                colliders,
                x: x,
                y: y + this.velocity.y,
                w: w,
                h: h,
            })
        ) {
            this.centerPosition.y += this.velocity.y;
        }
    }

    getAttackBox({ direction }) {
        if (direction === 'w') {
            this.attackBox = {
                x: this.centerPosition.x + this.playerDefault.ATTACK_BOX.UP.X,
                y: this.centerPosition.y + this.playerDefault.ATTACK_BOX.UP.Y,
                w: this.playerDefault.ATTACK_BOX.UP.W,
                h: this.playerDefault.ATTACK_BOX.UP.H,
            };
        }
        if (direction === 'a') {
            this.attackBox = {
                x: this.centerPosition.x + this.playerDefault.ATTACK_BOX.LEFT.X,
                y: this.centerPosition.y + this.playerDefault.ATTACK_BOX.LEFT.Y,
                w: this.playerDefault.ATTACK_BOX.LEFT.W,
                h: this.playerDefault.ATTACK_BOX.LEFT.H,
            };
        }
        if (direction === 'd') {
            this.attackBox = {
                x: this.centerPosition.x + this.playerDefault.ATTACK_BOX.RIGHT.X,
                y: this.centerPosition.y + this.playerDefault.ATTACK_BOX.RIGHT.Y,
                w: this.playerDefault.ATTACK_BOX.RIGHT.W,
                h: this.playerDefault.ATTACK_BOX.RIGHT.H,
            };
        }
        if (direction === 's') {
            this.attackBox = {
                x: this.centerPosition.x + this.playerDefault.ATTACK_BOX.DOWN.X,
                y: this.centerPosition.y + this.playerDefault.ATTACK_BOX.DOWN.Y,
                w: this.playerDefault.ATTACK_BOX.DOWN.W,
                h: this.playerDefault.ATTACK_BOX.DOWN.H,
            };
        }
    }
}
