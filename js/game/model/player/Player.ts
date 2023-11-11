import PlayerBaseState from './state/PlayerBaseState.js';
import PlayerIdleState from './state/PlayerIdleState.js';
import PlayerMoveState from './state/PlayerMoveState.js';
import PlayerAttackState from './state/PlayerAttackState.js';
import PlayerAttackTwoState from './state/PlayerAttackTwoState.js';
import PlayerDashState from './state/PlayerDashState.js';
import Game from '../game/Game.js';
import PlayerAimingState from './state/PlayerAimingState.js';
import PlayerHurtState from './state/PlayerHurtState.js';
import PlayerThrowingState from './state/PlayerThrowingState.js';
import GameSettings from '../../constants.js';
import PlayerSpawnState from './state/PlayerSpawnState.js';
import PlayerDeathState from './state/PlayerDeathState.js';
import PlayerInElevatorState from './state/PlayerInElevatorState.js';
import Observable from '../utility/Observable.js';
import HitBoxComponent from '../utility/HitBoxComponent.js';
import Collider from '../collideable/Collider.js';
import { Vector } from '../utility/interfaces/Vector.js';
import { Box } from '../utility/interfaces/Box.js';
import InteractionBar from '../interactables/InteractionBar.js';
import AngleHelper from '../utility/helper/AngleHelper.js';
import AudioManager from '../utility/manager/AudioManager.js';
import { Outfit } from '../utility/enums/Outfit.js';
import Shadow from '../shadow/Shadow.js';
import Grenade from './Grenade';

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
    private _health: number;
    private _healthPack: number;
    private _stamina: number;
    private _bombs: number;
    private _bullets: number;
    private readonly friction: number;
    private readonly _maxSpeed: number;
    private readonly _attackMoveSpeed: number;
    private readonly _dashMoveSpeed: number;
    private _velocity: Vector;
    private _lookAngle: number;
    private _width: number;
    private _height: number;
    private _hitbox: HitBoxComponent;
    private _attackBox: Box;
    private _centerPosition: Vector;
    private _lastDirection: string;
    private _combo: boolean;
    private _counter: number;
    private _healing: number;
    private _immunity: number;
    private readonly _projectiles: Grenade[];
    private _playerDefault: any;
    private _outfit: Outfit;
    private _inputEventEmitter: Observable;
    private readonly _interactionBar: InteractionBar;
    private readonly _maxHealth: number;
    private readonly _keys: string[];
    private readonly _clicks: string[];
    private _attackObserver: Observable;
    private _isBelowGround: boolean;
    private shadow: Shadow;

    public constructor(inputEventEmitter: Observable) {
        const { PLAYER: playerDefault } = GameSettings;
        this._maxHealth = playerDefault.MAX_HEALTH;
        this._health = playerDefault.MAX_HEALTH;
        this._healthPack = playerDefault.MAX_HEALTHPACKS;
        this._stamina = playerDefault.MAX_STAMINA;
        this._bombs = playerDefault.MAX_BOMBS;
        this._bullets = playerDefault.MAX_BULLETS;
        this.friction = playerDefault.FRICTION;
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
        this._outfit = Outfit.default;
        this._inputEventEmitter = inputEventEmitter;
        this._interactionBar = new InteractionBar(this, inputEventEmitter);
        this._keys = [];
        this._clicks = [];
        this._attackObserver = new Observable();
        this._isBelowGround = false;
        this.shadow = new Shadow(1.5);

        this.eventHandler();
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    get isBelowGround(): boolean {
        return this._isBelowGround;
    }

    set isBelowGround(value: boolean) {
        this._isBelowGround = value;
    }

    get attackObserver(): Observable {
        return this._attackObserver;
    }

    set attackObserver(value: Observable) {
        this._attackObserver = value;
    }

    get interactionBar(): InteractionBar {
        return this._interactionBar;
    }

    get healthPack(): number {
        return this._healthPack;
    }

    set healthPack(value: number) {
        this._healthPack = value;
    }

    get maxSpeed(): number {
        return this._maxSpeed;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get hitbox(): HitBoxComponent {
        return this._hitbox;
    }

    set hitbox(value: HitBoxComponent) {
        this._hitbox = value;
    }

    get counter(): number {
        return this._counter;
    }

    set counter(value: number) {
        this._counter = value;
    }

    get healing(): number {
        return this._healing;
    }

    set healing(value: number) {
        this._healing = value;
    }

    get projectiles(): any[] {
        return this._projectiles;
    }

    get outfit(): Outfit {
        return this._outfit;
    }

    set outfit(value: Outfit) {
        this._outfit = value;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
    }

    get bombs(): number {
        return this._bombs;
    }

    set bombs(value: number) {
        this._bombs = value;
    }

    get immunity(): number {
        return this._immunity;
    }

    set immunity(value: number) {
        this._immunity = value;
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

    get attackBox(): Box {
        return this._attackBox;
    }

    get lookAngle(): number {
        return this._lookAngle;
    }

    get lastDirection(): string {
        return this._lastDirection;
    }

    set lastDirection(value: string) {
        this._lastDirection = value;
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
        if (this._health <= 0 && this.currState !== this.deathState) {
            this.switchState(this.deathState);
        }

        this.updateBombs();

        if (this.currState !== this.spawnState) {
            this.shadow.renderShadow(new Vector(this.centerPosition.x, this.centerPosition.y + 12.5));
        }

        this.updateCounter();

        this.currState.updateState(this);

        if (this.currState !== this.deathState) {
            this.playerEffectsHandler();
        }

        if (this.currState !== this.inElevatorState) {
            this.moveHandler(colliders);
        }

        this.currState.drawImage(this);

        this.playerEffectsHandler(true);

        this.heal();

        this._interactionBar.update();
        if (Game.debug) {
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

    public damage(amount: number) {
        if (this.currState === this.deathState) {
            return;
        }

        if (this._immunity < 50 || this.currState === this.dashState) {
            return;
        }

        this._immunity = 0;
        this._health -= amount;

        if (this.currState !== this.hurtState) {
            this.switchState(this.hurtState);
        }
    }

    public regenerateStamina() {
        if (this._stamina < 100) {
            this._stamina += 0.5 * Game.deltaTime;
        }
    }

    public handleSwitchState({ move, attackOne, attackTwo, dash, aim, throws }: PlayerSwitchState) {
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

    public switchState(newState: PlayerBaseState) {
        this.currState.exitState(this);
        this.currState = newState;
        this.currState.enterState(this);
    }

    public moveHandler(colliders: Collider[]) {
        this._velocity.x = this._velocity.x * (1 - this.friction * Game.movementDeltaTime);
        this._velocity.y = this._velocity.y * (1 - this.friction * Game.movementDeltaTime);

        let { x, y, w, h } = this._hitbox.getPoints(this._centerPosition, this._width, this._height);

        if (
            this.checkCollision({
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
            this.checkCollision({
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

    public isInElevator() {
        return this.currState === this.inElevatorState;
    }

    private checkCollision({ colliders, x, y, w, h }) {
        return colliders.every((c: Collider) => {
            return c.checkCollision({
                x: x,
                y: y,
                w: w,
                h: h,
            });
        });
    }

    private updateBombs() {
        if (this._bombs > 2) {
            return;
        }

        this._bombs += 0.001 * Game.deltaTime;
    }

    private updateCounter() {
        if (this._counter >= 1) {
            this._counter = 0;
        }

        this._counter += Game.deltaTime;
    }

    private heal() {
        if (!this.keys.includes('q')) {
            return;
        }

        this.keys.splice(this.keys.indexOf('q'), 1);

        if (this._healthPack <= 0) {
            return;
        }

        this._healthPack -= 1;
        this._health = 6;
        this._healing = 6;
    }

    private eventHandler() {
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
                const playerX = this._centerPosition.x * GameSettings.GAME.GAME_SCALE;
                const playerY = this._centerPosition.y * GameSettings.GAME.GAME_SCALE;

                this._lookAngle = AngleHelper.getAngle({
                    x: data.x - playerX,
                    y: data.y - playerY,
                });
            }
        });

        this.attackObserver.subscribe(({ event, data }) => {
            if (event === 'attack') {
                this.playerAttackCollision(data.position);
                return;
            }
            if (event === 'attackArea') {
                this.playerAttackCollisionArea(data);
                return;
            }
            if (event === 'playerHitArea') {
                this.bullets += 1;
                this.bullets = Math.min(this.bullets, this._playerDefault.MAX_BULLETS);
            }
        });
    }

    private playerAttackCollisionArea(box: Box) {
        if (this.currState === this.dashState) {
            return false;
        }

        if (this.currState === this.inElevatorState) {
            return false;
        }

        if (this.detectCollisionBox(box)) {
            this.damage(1);
            return true;
        }

        return false;
    }

    private playerAttackCollision(position: Vector) {
        if (this.currState === this.dashState) {
            return false;
        }

        if (this.currState === this.inElevatorState) {
            return false;
        }

        if (this.detectCollision(position)) {
            this.damage(1);
            return true;
        }

        return false;
    }

    private detectCollision(position: Vector) {
        return this.centerPosition.x + this.hitbox.xOffset < position.x && this.centerPosition.x + this.width - this.hitbox.wOffset > position.x && this.centerPosition.y + this.hitbox.yOffset < position.y && this.centerPosition.y + this.height - this.hitbox.hOffset > position.y;
    }

    private detectCollisionBox(box: Box) {
        const enemyX1 = box.x;
        const enemyX2 = box.x + box.w;
        const enemyY1 = box.y;
        const enemyY2 = box.y + box.h;

        const playerX1 = this.centerPosition.x + this.hitbox.xOffset;
        const playerX2 = this.centerPosition.x + this.hitbox.xOffset + this.width - this.hitbox.wOffset;
        const playerY1 = this.centerPosition.y + this.hitbox.yOffset;
        const playerY2 = this.centerPosition.y + this.hitbox.yOffset + this.height - this.hitbox.hOffset;
        return enemyX1 < playerX2 && enemyX2 > playerX1 && enemyY1 < playerY2 && enemyY2 > playerY1;
    }

    private playerEffectsHandler(clear = false) {
        if (clear) {
            this.clearFilter();
            return;
        }
        this.damagedHandler();
        this.healingHandler();
    }

    private damagedHandler() {
        if (this.immunity < 50) {
            this.immunity += Game.deltaTime;
        }
        if (this.immunity <= 5) {
            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%) invert(100%)');
        }
    }

    private healingHandler() {
        if (this.healing === 6) {
            AudioManager.playAudio('player_medkit_use_audio').then();
        }
        if (this.healing > 0) {
            this.healing -= Game.deltaTime;
        }

        if (this.healing > 0) {
            const { ctx } = Game.getInstance();

            Game.getInstance().setFilter('sepia(100%) hue-rotate(111deg) saturate(1000%) contrast(118%)');

            ctx.strokeStyle = 'rgb(0, 255, 0)';
            ctx.lineWidth = (this.healing / 3) * 3;
            ctx.save();
            ctx.translate(this.centerPosition.x - 15, this.centerPosition.y - 30);
            ctx.rotate(Math.PI / 4);

            ctx.strokeRect(10, -15, this.width - this.hitbox.xOffset, this.width - this.hitbox.xOffset);
            ctx.restore();
        }
    }

    private clearFilter() {
        if (this.immunity <= 5 || this.healing >= 0) {
            Game.getInstance().setFilter('none');
        }
    }
}
