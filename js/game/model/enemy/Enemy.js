import Game from '../game/Game.js';
import Animateable from '../utility/Animateable.js';
import DistanceHelper from '../utility/DistanceHelper.js';
export default class Enemy extends Animateable {
    constructor(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver) {
        super();
        this._hitbox = hitbox;
        this._health = maxHealth;
        this._maxHealth = maxHealth;
        this._width = width;
        this._height = height;
        this._position = position;
        this._enemyObserver = enemyObserver;
        this._attackObserver = attackObserver;
        this._damaged = -1;
        this._velocity = {
            value: 0,
            angle: 0,
        };
    }
    get enemyObserver() {
        return this._enemyObserver;
    }
    set enemyObserver(value) {
        this._enemyObserver = value;
    }
    get attackObserver() {
        return this._attackObserver;
    }
    set attackObserver(value) {
        this._attackObserver = value;
    }
    get hitbox() {
        return this._hitbox;
    }
    set hitbox(value) {
        this._hitbox = value;
    }
    get health() {
        return this._health;
    }
    set health(value) {
        this._health = value;
    }
    get maxHealth() {
        return this._maxHealth;
    }
    set maxHealth(value) {
        this._maxHealth = value;
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
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
    }
    get damaged() {
        return this._damaged;
    }
    set damaged(value) {
        this._damaged = value;
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(value) {
        this._velocity = value;
    }
    handleDamage({ amount, angle }) {
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
    knockback() {
        this._position.x += DistanceHelper.getHorizontalValue(this._velocity);
        this._position.y += DistanceHelper.getVerticalValue(this._velocity);
        this._velocity.value *= 0.9;
    }
    debugMode() {
        const { ctx } = Game.getInstance();
        ctx.fillStyle = 'rgb(255, 255, 0, 0.5)';
        const { x, y, w, h } = this._hitbox.getPoints(this._position, this._width, this._height);
        ctx.fillRect(x, y, w, h);
    }
}
