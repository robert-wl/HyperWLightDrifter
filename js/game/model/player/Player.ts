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
import Collider from '../collideable/Collider.js';
import { getAngle } from '../../helper/angleHelper.js';
import { Vector } from '../utility/enums/Vector.js';
import { Box } from '../utility/enums/Box.js';

export default class Player {
    public currState: PlayerBaseState;
    public spawnState: PlayerSpawnState;
    public idleState: PlayerIdleState;
    public moveState: PlayerMoveState;
    public attackState: PlayerAttackState;
    public dashState: PlayerDashState;
    public attackTwoState: PlayerAttackTwoState;
    public aimState: PlayerAimingState;
    public hurtState: PlayerHurtState;
    public throwState: PlayerThrowingState;
    public deathState: PlayerDeathState;
    public inElevatorState: PlayerInElevatorState;
    private health: number;
    private healthPack: number;
    private _stamina: number;
    private bombs: number;
    private _bullets: number;
    private friction: number;
    private maxSpeed: number;
    private _attackMoveSpeed: number;
    private _dashMoveSpeed: number;
    private _velocity: Vector;
    private _lookAngle: number;
    private width: number;
    private height: number;
    private hitbox: HitBoxComponent;
    private _attackBox: Box;
    private _centerPosition: Vector;
    private _lastDirection: string;
    private _combo: boolean;
    private counter: number;
    private healing: number;
    private immunity: number;
    private projectiles: any[];
    private playerDefault: any;
    private outfit: string;
    private inputEventEmitter: Observable;
    private readonly maxhealth: number;
    private _keys: string[];
    private _clicks: string[];

    public constructor(inputEventEmitter: Observable) {
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

    get stamina(): number {
        return this._stamina;
    }

    set stamina(value: number) {
        this._stamina = value;
    }

    get dashMoveSpeed(): number {
        return this._dashMoveSpeed;
    }

    set dashMoveSpeed(value: number) {
        this._dashMoveSpeed = value;
    }

    get bullets(): number {
        return this._bullets;
    }

    set bullets(value: number) {
        this._bullets = value;
    }

    get keys(): string[] {
        return this._keys;
    }

    get clicks(): string[] {
        return this._clicks;
    }

    get attackMoveSpeed(): number {
        return this._attackMoveSpeed;
    }

    set attackMoveSpeed(value: number) {
        this._attackMoveSpeed = value;
    }

    get attackBox(): Box {
        return this._attackBox;
    }

    set attackBox(value: Box) {
        this._attackBox = value;
    }

    get lookAngle(): number {
        return this._lookAngle;
    }

    set lookAngle(value: number) {
        this._lookAngle = value;
    }

    get lastDirection(): string {
        return this._lastDirection;
    }

    set lastDirection(value: string) {
        this._lastDirection = value;
    }

    get combo(): boolean {
        return this._combo;
    }

    set combo(value: boolean) {
        this._combo = value;
    }

    get velocity(): Vector {
        return this._velocity;
    }

    set velocity(value: Vector) {
        this._velocity = value;
    }

    get centerPosition(): Vector {
        return this._centerPosition;
    }

    set centerPosition(value: Vector) {
        this._centerPosition = value;
    }

    public updateState(colliders: Collider[]) {
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

    public damage({ angle }) {
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

    public regenerateStamina() {
        const { deltaTime } = Game.getInstance();
        if (this._stamina < 100) {
            this._stamina += 0.5 * deltaTime;
        }
    }

    public handleSwitchState({ move, attackOne, attackTwo, dash, aim, throws }: PlayerSwitchState) {
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

    public switchState(newState: PlayerBaseState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    public moveHandler(colliders: Collider[]) {
        const { movementDeltaTime } = Game.getInstance();

        this._velocity.x = this._velocity.x * (1 - this.friction * movementDeltaTime);
        this._velocity.y = this._velocity.y * (1 - this.friction * movementDeltaTime);

        let { x, y, w, h } = this.hitbox.getPoints(this._centerPosition, this.width, this.height);

        if (
            checkCollision({
                colliders,
                x: x + this._velocity.x,
                y: y,
                w: w,
                h: h,
            })
        ) {
            this._centerPosition.x += this._velocity.x;
        }

        if (
            checkCollision({
                colliders,
                x: x,
                y: y + this._velocity.y,
                w: w,
                h: h,
            })
        ) {
            this._centerPosition.y += this._velocity.y;
        }
    }

    public getAttackBox({ direction }) {
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

    private updateBombs() {
        if (this.bombs > 2) {
            return;
        }

        const { deltaTime } = Game.getInstance();
        this.bombs += 0.001 * deltaTime;
    }

    private updateCounter() {
        const { deltaTime } = Game.getInstance();
        if (this.counter >= 1) {
            this.counter = 0;
        }

        this.counter += deltaTime;
    }

    private heal() {
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

    private eventHandler() {
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
