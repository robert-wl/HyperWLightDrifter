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
import Observable from '../utility/Observable.js';
import HitBoxComponent from '../utility/HitBoxComponent.js';
import { getAngle } from '../../helper/angleHelper.js';
import { Vector } from '../utility/enums/Vector.js';
import { Box } from '../utility/enums/Box.js';
import InteractionBar from '../interactables/InteractionBar.js';
export default class Player {
    constructor(inputEventEmitter) {
        const { player: playerDefault } = GameSettings;
        this.maxhealth = playerDefault.MAX_HEALTH;
        this._health = playerDefault.MAX_HEALTH;
        this._healthPack = playerDefault.MAX_HEALTHPACKS;
        this._stamina = playerDefault.MAX_STAMINA;
        this._bombs = playerDefault.MAX_BOMBS;
        this._bullets = playerDefault.MAX_BULLETS;
        this._friction = playerDefault.FRICTION;
        this._maxSpeed = playerDefault.MAX_SPEED;
        this._attackMoveSpeed = playerDefault.ATTACK_MOVE_SPEED;
        this._dashMoveSpeed = playerDefault.DASH_MOVE_SPEED;
        this._width = playerDefault.WIDTH;
        this._height = playerDefault.HEIGHT;
        this._lastDirection = playerDefault.LAST_DIRECTION;
        this._velocity = Vector.Zero();
        this._lookAngle = 0;
        this._hitbox = new HitBoxComponent(-this._width / 2 + 10, -this._height / 2 + 5, 20, 10);
        this._attackBox = Box.Zero();
        this._centerPosition = new Vector(playerDefault.START_POSITION.x + this._width / 2, playerDefault.START_POSITION.y + this._height / 2);
        this._combo = false;
        this._counter = 0;
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
        this._playerDefault = playerDefault;
        this._healing = 0;
        this._immunity = playerDefault.MAX_IMMUNITY;
        this._projectiles = [];
        this._outfit = 'default';
        this._inputEventEmitter = inputEventEmitter;
        this._interactionBar = new InteractionBar(this, inputEventEmitter);
        this._keys = [];
        this._clicks = [];
        this._attackObserver = new Observable();
        this.eventHandler();
    }
    get attackObserver() {
        return this._attackObserver;
    }
    set attackObserver(value) {
        this._attackObserver = value;
    }
    get interactionBar() {
        return this._interactionBar;
    }
    set interactionBar(value) {
        this._interactionBar = value;
    }
    get healthPack() {
        return this._healthPack;
    }
    set healthPack(value) {
        this._healthPack = value;
    }
    get friction() {
        return this._friction;
    }
    set friction(value) {
        this._friction = value;
    }
    get maxSpeed() {
        return this._maxSpeed;
    }
    set maxSpeed(value) {
        this._maxSpeed = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get hitbox() {
        return this._hitbox;
    }
    set hitbox(value) {
        this._hitbox = value;
    }
    get counter() {
        return this._counter;
    }
    set counter(value) {
        this._counter = value;
    }
    get healing() {
        return this._healing;
    }
    set healing(value) {
        this._healing = value;
    }
    get projectiles() {
        return this._projectiles;
    }
    set projectiles(value) {
        this._projectiles = value;
    }
    get playerDefault() {
        return this._playerDefault;
    }
    set playerDefault(value) {
        this._playerDefault = value;
    }
    get inputEventEmitter() {
        return this._inputEventEmitter;
    }
    set inputEventEmitter(value) {
        this._inputEventEmitter = value;
    }
    get outfit() {
        return this._outfit;
    }
    set outfit(value) {
        this._outfit = value;
    }
    get health() {
        return this._health;
    }
    set health(value) {
        this._health = value;
    }
    get bombs() {
        return this._bombs;
    }
    set bombs(value) {
        this._bombs = value;
    }
    get immunity() {
        return this._immunity;
    }
    set immunity(value) {
        this._immunity = value;
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
        if (this._health <= 0 && this.currState !== this.deathState) {
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
        this._projectiles.forEach((projectile) => projectile.update());
        this.heal();
        this._interactionBar.update();
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
        if (this._immunity < 50 || this.currState === this.dashState) {
            return;
        }
        this._immunity = 0;
        this._health -= 1;
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
        if (this._keys.includes('c') && throws && this._bombs >= 1) {
            this._bombs -= 1;
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
        this._velocity.x = this._velocity.x * (1 - this._friction * movementDeltaTime);
        this._velocity.y = this._velocity.y * (1 - this._friction * movementDeltaTime);
        let { x, y, w, h } = this._hitbox.getPoints(this._centerPosition, this._width, this._height);
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
                x: this._centerPosition.x + this._playerDefault.ATTACK_BOX.UP.X,
                y: this._centerPosition.y + this._playerDefault.ATTACK_BOX.UP.Y,
                w: this._playerDefault.ATTACK_BOX.UP.W,
                h: this._playerDefault.ATTACK_BOX.UP.H,
            };
        }
        if (direction === 'a') {
            this._attackBox = {
                x: this._centerPosition.x + this._playerDefault.ATTACK_BOX.LEFT.X,
                y: this._centerPosition.y + this._playerDefault.ATTACK_BOX.LEFT.Y,
                w: this._playerDefault.ATTACK_BOX.LEFT.W,
                h: this._playerDefault.ATTACK_BOX.LEFT.H,
            };
        }
        if (direction === 'd') {
            this._attackBox = {
                x: this._centerPosition.x + this._playerDefault.ATTACK_BOX.RIGHT.X,
                y: this._centerPosition.y + this._playerDefault.ATTACK_BOX.RIGHT.Y,
                w: this._playerDefault.ATTACK_BOX.RIGHT.W,
                h: this._playerDefault.ATTACK_BOX.RIGHT.H,
            };
        }
        if (direction === 's') {
            this._attackBox = {
                x: this._centerPosition.x + this._playerDefault.ATTACK_BOX.DOWN.X,
                y: this._centerPosition.y + this._playerDefault.ATTACK_BOX.DOWN.Y,
                w: this._playerDefault.ATTACK_BOX.DOWN.W,
                h: this._playerDefault.ATTACK_BOX.DOWN.H,
            };
        }
    }
    updateBombs() {
        if (this._bombs > 2) {
            return;
        }
        const { deltaTime } = Game.getInstance();
        this._bombs += 0.001 * deltaTime;
    }
    updateCounter() {
        const { deltaTime } = Game.getInstance();
        if (this._counter >= 1) {
            this._counter = 0;
        }
        this._counter += deltaTime;
    }
    heal() {
        const { keys } = Game.getInstance();
        if (!keys.includes('q')) {
            return;
        }
        keys.splice(keys.indexOf('q'), 1);
        if (this._healthPack <= 0) {
            return;
        }
        this._healthPack -= 1;
        this._health = 6;
        this._healing = 6;
    }
    eventHandler() {
        this._inputEventEmitter.subscribe(({ event, data }) => {
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
        this.attackObserver.subscribe(({ event, data }) => {
            if (event === 'attack') {
                this.playerAttackCollision(data.position);
                this.damage({ angle: 0 });
            }
        });
    }
    playerAttackCollision(position, angle) {
        if (this.currState === this.dashState) {
            return false;
        }
        if (this.currState === this.inElevatorState) {
            return false;
        }
        if (this.detectCollision(position)) {
            this.damage({
                angle: Math.PI,
            });
            return true;
        }
        return false;
    }
    detectCollision(position) {
        return this.centerPosition.x + this.hitbox.xOffset < position.x && this.centerPosition.x + this.width - this.hitbox.wOffset > position.x && this.centerPosition.y + this.hitbox.yOffset < position.y && this.centerPosition.y + this.height - this.hitbox.hOffset > position.y;
    }
}
