import Game from '../../game/Game.js';
import Enemy from '../Enemy.js';
import HealthBar from '../healthBar/HealthBar.js';
import { getHorizontalValue, getManhattanDistance, getVerticalValue } from '../../../helper/distanceHelper.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import { getRandomBoolean } from '../../../helper/randomHelper.js';
import { Vector } from '../../utility/enums/Vector';
import HitBoxComponent from '../../utility/HitBoxComponent';
import Observable from '../../utility/Observable';

export default class JudgementBomb extends Enemy {
    private angle: number;
    private offset: number;
    private positionFollow: Vector;
    private _spawning: boolean;
    private exploding: boolean;
    private lifeTime: number;
    private healthbar: HealthBar;
    private moveAngle: number;

    constructor(position: Vector, width: number, height: number, hitbox: HitBoxComponent, maxHealth: number, angle: number, offset: number, lifetime: number, enemyObserver: Observable, attackObserver: Observable) {
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
        this.healthbar = HealthBar.generate({
            position: this.position,
            offset: {
                x: 3,
                y: 30,
            },
            maxHealth: this.maxHealth,
        });
        this.moveAngle = Math.random() * Math.PI * 2;
    }

    get spawning(): boolean {
        return this._spawning;
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
                x: getHorizontalValue({
                    initial: this.position.x,
                    magnitude: this.offset,
                    angle: this.angle,
                }),
                y: getVerticalValue({
                    initial: this.position.y,
                    magnitude: this.offset,
                    angle: this.angle,
                }),
            },
        });

        if (Game.getInstance().debug) {
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
            this.position = { ...this.positionFollow };
        }

        this.handleExplosion();

        if (this._spawning) {
            return;
        }

        const { deltaTime } = Game.getInstance();
        this.lifeTime -= deltaTime;
    }

    kill() {
        this.enemyObserver.notify('clearBossEntity', this);
    }

    drawBomb() {
        const judgementBomb = getNumberedImage('judgement_bomb', this.animationStage);
        drawImage({
            img: judgementBomb,
            x: getHorizontalValue({
                initial: this.position.x,
                magnitude: this.offset,
                angle: this.angle,
            }),
            y: getVerticalValue({
                initial: this.position.y,
                magnitude: this.offset,
                angle: this.angle,
            }),
            width: judgementBomb.width * GameSettings.GAME.GAME_SCALE,
            height: judgementBomb.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }

    drawExplosion() {
        // console.log(this.animationStage - 3);
        const judgementExplosion = getNumberedImage('judgement_explosion', this.animationStage - 3);

        drawImage({
            img: judgementExplosion,
            x: getHorizontalValue({
                initial: this.position.x,
                magnitude: this.offset,
                angle: this.angle,
            }),
            y: getVerticalValue({
                initial: this.position.y,
                magnitude: this.offset,
                angle: this.angle,
            }),
            width: judgementExplosion.width * GameSettings.GAME.GAME_SCALE,
            height: judgementExplosion.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }

    isAboutToExplode() {
        return this.lifeTime <= 160;
    }

    handleExplosion() {
        const { player, deltaTime } = Game.getInstance();

        if (this.exploding) {
            this.drawExplosion();

            this.advanceAnimationStage(7);

            this.animationStage = Math.min(this.animationStage, 11);

            const distance = getManhattanDistance({
                x:
                    player.centerPosition.x -
                    getHorizontalValue({
                        initial: this.position.x,
                        magnitude: this.offset,
                        angle: this.angle,
                    }),
                y:
                    player.centerPosition.y -
                    getVerticalValue({
                        initial: this.position.y,
                        magnitude: this.offset,
                        angle: this.angle,
                    }),
            });

            if (distance < 150) {
                player.damage({
                    amount: 3,
                    angle: 0,
                });
            }
        }

        if (!this.exploding) {
            if (this.animationStage === 5 && this.checkCounter(10) && getRandomBoolean(0.15)) {
                this.animationStage--;

                if (!this._spawning) {
                    this.moveAngle = Math.random() * Math.PI * 2;
                }
            }

            this.position.x += getHorizontalValue({
                magnitude: 3 * deltaTime,
                angle: this.moveAngle,
            });
            this.position.y += getVerticalValue({
                magnitude: 3 * deltaTime,
                angle: this.moveAngle,
            });
        }

        if (this.lifeTime <= 50) {
            this.exploding = true;
        }
    }
}
