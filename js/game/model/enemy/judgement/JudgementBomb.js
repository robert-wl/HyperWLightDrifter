import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import HealthBar from '../healthBar/HealthBar.js';
import GameSettings from '../../../constants.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
export default class JudgementBomb extends Enemy {
    constructor(position, width, height, hitbox, maxHealth, angle, offset, lifetime, enemyObserver, attackObserver) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.angle = angle;
        this.offset = offset;
        this.positionFollow = position;
        this.position = position;
        this._spawning = true;
        this.exploding = false;
        this.lifeTime = lifetime;
        this.animationStage = 1;
        this.number = 0;
        this.healthbar = new HealthBar(new Vector(3, 30), this.maxHealth);
        this.moveAngle = Math.random() * Math.PI * 2;
    }
    get spawning() {
        return this._spawning;
    }
    set spawning(value) {
        this._spawning = value;
    }
    update() {
        this.handleTimer();
        this.drawBomb();
        const pVector = new PolarVector(this.offset, this.angle);
        this.healthbar.update({
            health: this.health,
            position: {
                x: DistanceHelper.getHorizontalValue(pVector, this.position.x),
                y: DistanceHelper.getVerticalValue(pVector, this.position.y),
            },
        });
        if (Game.debug) {
            this.debugMode();
        }
        if (this.animationStage === 11) {
            this.kill();
        }
    }
    handleTimer() {
        this.updateNumberCounter();
        if (this.health <= 0 && this.animationStage < 11) {
            this.advanceAnimationStage(10);
            return;
        }
        if (this.animationStage < 5) {
            this.advanceAnimationStage(10);
            this.animationStage = Math.min(this.animationStage, 5);
        }
        if (this._spawning) {
            this.position = Object.assign({}, this.positionFollow);
        }
        this.handleExplosion();
        if (this._spawning) {
            return;
        }
        this.lifeTime -= Game.deltaTime;
    }
    kill() {
        this.enemyObserver.notify('clearBossEntity', this);
    }
    drawBomb() {
        const judgementBomb = AssetManager.getNumberedImage('judgement_bomb', this.animationStage);
        const pVector = new PolarVector(this.offset, this.angle);
        const imageSize = Box.parse({
            x: DistanceHelper.getHorizontalValue(pVector, this.position.x),
            y: DistanceHelper.getVerticalValue(pVector, this.position.y),
            w: judgementBomb.width * GameSettings.GAME.GAME_SCALE,
            h: judgementBomb.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementBomb, imageSize, true);
    }
    drawExplosion() {
        // console.log(this.animationStage - 3);
        const judgementExplosion = AssetManager.getNumberedImage('judgement_explosion', this.animationStage - 3);
        const pVector = new PolarVector(this.offset, this.angle);
        const imageSize = Box.parse({
            x: DistanceHelper.getHorizontalValue(pVector, this.position.x),
            y: DistanceHelper.getVerticalValue(pVector, this.position.y),
            w: judgementExplosion.width * GameSettings.GAME.GAME_SCALE,
            h: judgementExplosion.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(judgementExplosion, imageSize, true);
    }
    isAboutToExplode() {
        return this.lifeTime <= 160;
    }
    handleExplosion() {
        const { player } = Game.getInstance();
        if (this.exploding) {
            this.drawExplosion();
            this.advanceAnimationStage(7);
            this.animationStage = Math.min(this.animationStage, 11);
            const pVector = new PolarVector(this.offset, this.angle);
            const distance = DistanceHelper.getManhattanDistance({
                x: player.centerPosition.x - DistanceHelper.getHorizontalValue(pVector, this.position.x),
                y: player.centerPosition.y - DistanceHelper.getVerticalValue(pVector, this.position.y),
            });
            if (distance < 150) {
                player.damage({
                    amount: 3,
                    angle: 0,
                });
            }
        }
        if (!this.exploding) {
            if (this.animationStage === 5 && this.checkCounter(10) && RandomHelper.getRandomBoolean(0.15)) {
                this.animationStage--;
                if (!this._spawning) {
                    this.moveAngle = Math.random() * Math.PI * 2;
                }
            }
            const pVector = new PolarVector(3 * Game.deltaTime, this.moveAngle);
            this.position.x += DistanceHelper.getHorizontalValue(pVector);
            this.position.y += DistanceHelper.getVerticalValue(pVector);
        }
        if (this.lifeTime <= 50) {
            this.exploding = true;
        }
    }
}
