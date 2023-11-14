import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import HealthBar from '../healthBar/HealthBar.js';
import GameSettings from '../../../constants.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import HitBoxComponent from '../../utility/HitBoxComponent.js';
import Observable from '../../utility/Observable.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import RandomHelper from '../../utility/helper/RandomHelper.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';
import AngleHelper from '../../utility/helper/AngleHelper.js';

export default class JudgementBomb extends Enemy {
    private readonly angle: number;
    private positionFollow: Vector;
    private readonly offset: number;
    private _spawning: boolean;
    private exploding: boolean;
    private lifeTime: number;
    private healthbar: HealthBar;
    private moveAngle: number;

    constructor(position: Vector, positionFollow: Vector, offset: number, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, angle: number, lifetime: number, enemyObserver: Observable, attackObserver: Observable) {
        super(position, width, height, hitbox, maxHealth, enemyObserver, attackObserver);
        this.angle = angle;
        this.positionFollow = positionFollow;
        this.offset = offset;
        this._spawning = true;
        this.exploding = false;
        this.lifeTime = lifetime;
        this.animationStage = 1;
        this.number = 0;
        this.healthbar = new HealthBar(new Vector(3, 30), this.maxHealth);
        this.moveAngle = Math.random() * Math.PI * 2;
    }

    set spawning(value: boolean) {
        this._spawning = value;
    }

    update() {
        this.handleTimer();

        this.drawBomb();

        this.healthbar.update({
            health: this.health,
            position: {
                x: this.position.x,
                y: this.position.y,
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
            const pVector = new PolarVector(this.offset, this.angle);
            this.position = Vector.parse({
                x: DistanceHelper.getHorizontalValue(pVector, this.positionFollow.x),
                y: DistanceHelper.getVerticalValue(pVector, this.positionFollow.y),
            });
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
        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: judgementBomb.width * GameSettings.GAME.GAME_SCALE,
            h: judgementBomb.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementBomb, imageSize, true);
    }

    drawExplosion() {
        const judgementExplosion = AssetManager.getNumberedImage('judgement_explosion', this.animationStage - 3);

        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: judgementExplosion.width * GameSettings.GAME.GAME_SCALE,
            h: judgementExplosion.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(judgementExplosion, imageSize, true);
    }

    isAboutToExplode() {
        return this.lifeTime <= 160;
    }

    handleDamage({ amount, angle }: { amount: any; angle: any }) {
        if (this._spawning) {
            return;
        }
        super.handleDamage({ amount, angle });
    }

    handleExplosion() {
        const { player } = Game.getInstance();

        if (this.exploding) {
            this.drawExplosion();

            this.advanceAnimationStage(7);

            this.animationStage = Math.min(this.animationStage, 11);

            const distance = DistanceHelper.getManhattanDistance({
                x: player.centerPosition.x - this.position.x,
                y: player.centerPosition.y - this.position.y,
            });

            if (distance < 150) {
                player.damage(3);
            }
        }

        if (!this.exploding) {
            if (this.animationStage === 5 && this.checkCounter(10) && RandomHelper.getRandomBoolean(0.05)) {
                this.animationStage--;

                if (!this._spawning) {
                    if (RandomHelper.getRandomBoolean(0.25)) {
                        this.moveAngle = Math.random() * Math.PI * 2;
                    } else {
                        this.moveAngle = AngleHelper.getAngle({
                            x: player.centerPosition.x - this.position.x,
                            y: player.centerPosition.y - this.position.y,
                        });
                    }
                }
            }

            const pVector = new PolarVector(GameSettings.GAME.ENEMY.JUDGEMENT_BOMB.SPEED * Game.deltaTime, this.moveAngle);
            this.position.x += DistanceHelper.getHorizontalValue(pVector);
            this.position.y += DistanceHelper.getVerticalValue(pVector);
        }

        if (this.lifeTime <= 50) {
            this.exploding = true;
        }
    }
}
