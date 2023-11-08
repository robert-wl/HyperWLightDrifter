import PlayerBaseState from './state/PlayerBaseState.js';
import PlayerIdleState from './state/PlayerIdleState.js';
import PlayerMoveState from './state/PlayerMoveState.js';
import PlayerAttackState from './state/PlayerAttackState.js';
import PlayerAttackTwoState from './state/PlayerAttackTwoState.js';
import PlayerDashState from './state/PlayerDashState.js';
import Game from '../game/Game.js';
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
import HitBoxComponent from '../utility/HitBoxComponent.js';
import { getAngle } from '../../helper/angleHelper.js';
import { Vector } from '../utility/enums/Vector.js';
import { Box } from '../utility/enums/Box.js';
export default class Player {
    constructor(inputEventEmitter) {
        const { player: playerDefault } = GameSettings;
        this.maxhealth = playerDefault.MAX_HEALTH;
        this.health = playerDefault.MAX_HEALTH;
        this.healthPack = playerDefault.MAX_HEALTHPACKS;
        this._stamina = playerDefault.MAX_STAMINA;
        this.bombs = playerDefault.MAX_BOMBS;
        this._bullets = playerDefault.MAX_BULLETS;
        this.friction = playerDefault.FRICTION;
        this.maxSpeed = playerDefault.MAX_SPEED;
        this._attackMoveSpeed = playerDefault.ATTACK_MOVE_SPEED;
        this._dashMoveSpeed = playerDefault.DASH_MOVE_SPEED;
        this.width = playerDefault.WIDTH;
        this.height = playerDefault.HEIGHT;
        this._lastDirection = playerDefault.LAST_DIRECTION;
        this._velocity = Vector.Zero();
        this._lookAngle = 0;
        this.hitbox = new HitBoxComponent(-this.width / 2 + 10, -this.height / 2 + 5, 20, 10);
        this._attackBox = Box.Zero();
        this._centerPosition = new Vector(playerDefault.START_POSITION.x + this.width / 2, playerDefault.START_POSITION.y + this.height / 2);
        this._combo = false;
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
        this.playerDefault = playerDefault;
        this.healing = 0;
        this.immunity = playerDefault.MAX_IMMUNITY;
        this.projectiles = [];
        this.outfit = 'default';
        this.inputEventEmitter = inputEventEmitter;
        this._keys = [];
        this._clicks = [];
        this.eventHandler();
    }
    get stamina() {
        return this._stamina;
    }
    set stamina(value) {
        this._stamina = value;
    }
    get dashMoveSpeed() {
        return this._dashMoveSpeed;
    }
    set dashMoveSpeed(value) {
        this._dashMoveSpeed = value;
    }
    get bullets() {
        return this._bullets;
    }
    set bullets(value) {
        this._bullets = value;
    }
    get keys() {
        return this._keys;
    }
    get clicks() {
        return this._clicks;
    }
    get attackMoveSpeed() {
        return this._attackMoveSpeed;
    }
    set attackMoveSpeed(value) {
        this._attackMoveSpeed = value;
    }
    get attackBox() {
        return this._attackBox;
    }
    set attackBox(value) {
        this._attackBox = value;
    }
    get lookAngle() {
        return this._lookAngle;
    }
    set lookAngle(value) {
        this._lookAngle = value;
    }
    get lastDirection() {
        return this._lastDirection;
    }
    set lastDirection(value) {
        this._lastDirection = value;
    }
    get combo() {
        return this._combo;
    }
    set combo(value) {
        this._combo = value;
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(value) {
        this._velocity = value;
    }
    get centerPosition() {
        return this._centerPosition;
    }
    set centerPosition(value) {
        this._centerPosition = value;
    }
    updateState(colliders) {
        if (this.health <= 0 && this.currState !== this.deathState) {
            this.switchState(this.deathState);
        }
        this.updateBombs();
        if (this.currState !== this.spawnState) {
            renderShadow({
                position: {
                    x: this._centerPosition.x,
                    y: this._centerPosition.y + 12.5,
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
        if (this.currState !== this.inElevatorState) {
            this.moveHandler(colliders);
        }
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
    renderDebugBox() {
        // Game.getInstance().ctx.fillStyle = this.playerDefault.DEBUG_COLOR;
        //
        // const { x, y, w, h } = this.getHitboxCoordinates();
        //
        // Game.getInstance().ctx.fillRect(x, y, w, h);
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
        this._velocity.x += getHorizontalValue({
            magnitude: 5 * movementDeltaTime,
            angle: angle + Math.PI,
        });
        this._velocity.y += getVerticalValue({
            magnitude: 5 * movementDeltaTime,
            angle: angle + Math.PI,
        });
    }
    regenerateStamina() {
        const { deltaTime } = Game.getInstance();
        if (this._stamina < 100) {
            this._stamina += 0.5 * deltaTime;
        }
    }
    handleSwitchState({ move, attackOne, attackTwo, dash, aim, throws }) {
        if (this._clicks.includes('right') && aim) {
            return this.switchState(this.aimState);
        }
        if (this._keys.includes('c') && throws && this.bombs >= 1) {
            this.bombs -= 1;
            return this.switchState(this.throwState);
        }
        if (this._clicks.includes('left') && attackOne) {
            return this.switchState(this.attackState);
        }
        if (this._combo && attackTwo) {
            return this.switchState(this.attackTwoState);
        }
        if (this._keys.includes(' ') && dash && this._stamina >= 10) {
            return this.switchState(this.dashState);
        }
        if (['w', 'a', 's', 'd'].some((key) => this._keys.includes(key)) && move) {
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
        const { movementDeltaTime } = Game.getInstance();
        this._velocity.x = this._velocity.x * (1 - this.friction * movementDeltaTime);
        this._velocity.y = this._velocity.y * (1 - this.friction * movementDeltaTime);
        let { x, y, w, h } = this.hitbox.getPoints(this._centerPosition, this.width, this.height);
        if (checkCollision({
            colliders,
            x: x + this._velocity.x,
            y: y,
            w: w,
            h: h,
        })) {
            this._centerPosition.x += this._velocity.x;
        }
        if (checkCollision({
            colliders,
            x: x,
            y: y + this._velocity.y,
            w: w,
            h: h,
        })) {
            this._centerPosition.y += this._velocity.y;
        }
    }
    getAttackBox({ direction }) {
        if (direction === 'w') {
            this._attackBox = {
                x: this._centerPosition.x + this.playerDefault.ATTACK_BOX.UP.X,
                y: this._centerPosition.y + this.playerDefault.ATTACK_BOX.UP.Y,
                w: this.playerDefault.ATTACK_BOX.UP.W,
                h: this.playerDefault.ATTACK_BOX.UP.H,
            };
        }
        if (direction === 'a') {
            this._attackBox = {
                x: this._centerPosition.x + this.playerDefault.ATTACK_BOX.LEFT.X,
                y: this._centerPosition.y + this.playerDefault.ATTACK_BOX.LEFT.Y,
                w: this.playerDefault.ATTACK_BOX.LEFT.W,
                h: this.playerDefault.ATTACK_BOX.LEFT.H,
            };
        }
        if (direction === 'd') {
            this._attackBox = {
                x: this._centerPosition.x + this.playerDefault.ATTACK_BOX.RIGHT.X,
                y: this._centerPosition.y + this.playerDefault.ATTACK_BOX.RIGHT.Y,
                w: this.playerDefault.ATTACK_BOX.RIGHT.W,
                h: this.playerDefault.ATTACK_BOX.RIGHT.H,
            };
        }
        if (direction === 's') {
            this._attackBox = {
                x: this._centerPosition.x + this.playerDefault.ATTACK_BOX.DOWN.X,
                y: this._centerPosition.y + this.playerDefault.ATTACK_BOX.DOWN.Y,
                w: this.playerDefault.ATTACK_BOX.DOWN.W,
                h: this.playerDefault.ATTACK_BOX.DOWN.H,
            };
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
        this.health = 6;
        this.healing = 6;
    }
    eventHandler() {
        this.inputEventEmitter.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                if (!this._keys.includes(data)) {
                    this._keys.push(data);
                }
                return;
            }
            if (event === 'keyup') {
                this._keys.splice(this._keys.indexOf(data), 1);
                return;
            }
            if (event === 'mousedown') {
                if (!this._clicks.includes(data)) {
                    this._clicks.push(data);
                }
                return;
            }
            if (event === 'mouseup') {
                this._clicks.splice(this._clicks.indexOf(data), 1);
                return;
            }
            if (event === 'mousemove') {
                //TODo: fix this
                const playerX = this._centerPosition.x * GameSettings.GAME.GAME_SCALE;
                const playerY = this._centerPosition.y * GameSettings.GAME.GAME_SCALE;
                this._lookAngle = getAngle({
                    x: data.x - playerX,
                    y: data.y - playerY,
                });
            }
        });
    }
}
