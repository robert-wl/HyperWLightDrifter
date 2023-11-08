import Game from '../game/Game.js';
import Animateable from '../utility/Animateable.js';
import DistanceHelper from '../utility/DistanceHelper.js';
import HitBoxComponent from '../utility/HitBoxComponent';
import { Vector } from '../utility/enums/Vector.js';
import Observable from '../utility/Observable';

export default abstract class Enemy extends Animateable {
    private _hitbox: HitBoxComponent;
    private _health: number;
    private _maxHealth: number;
    private _width: number;
    private _height: number;
    private _position: Vector;
    private _damaged: number;
    private _velocity: PolarVector;
    private _attackObserver: Observable;

    protected constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, attackObserver: Observable) {
        super();
        this._hitbox = hitbox;
        this._health = maxHealth;
        this._maxHealth = maxHealth;
        this._width = width;
        this._height = height;
        this._position = position;
        this._attackObserver = attackObserver;
        this._damaged = -1;
        this._velocity = {
            value: 0,
            angle: 0,
        };
    }

    get attackObserver(): Observable {
        return this._attackObserver;
    }

    set attackObserver(value: Observable) {
        this._attackObserver = value;
    }

    get hitbox(): HitBoxComponent {
        return this._hitbox;
    }

    set hitbox(value: HitBoxComponent) {
        this._hitbox = value;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    set maxHealth(value: number) {
        this._maxHealth = value;
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

    get position(): Vector {
        return this._position;
    }

    set position(value: Vector) {
        this._position = value;
    }

    get damaged(): number {
        return this._damaged;
    }

    set damaged(value: number) {
        this._damaged = value;
    }

    get velocity(): PolarVector {
        return this._velocity;
    }

    set velocity(value: PolarVector) {
        this._velocity = value;
    }

    public damage({ amount, angle }) {
        if (this._health <= 0) {
            return;
        }
        this._health -= amount;
        this._damaged = 5;
        if (this._health <= 0) {
            this._health = 0;
        }
        this._velocity = {
            value: 1,
            angle: angle,
        };
    }

    public knockback() {
        this._position.x += DistanceHelper.getHorizontalValue(this._velocity);
        this._position.y += DistanceHelper.getVerticalValue(this._velocity);
        this._velocity.value *= 0.9;
    }

    public debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';

        const { x, y, w, h } = this._hitbox.getPoints(this._position, this._width, this._height);
        ctx.fillRect(x, y, w, h);
    }

    public abstract update(): void;
}
