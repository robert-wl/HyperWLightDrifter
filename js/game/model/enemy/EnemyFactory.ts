import CrystalSpider from './crystalSpider/CrystalSpider.js';
import GameSettings from '../../constants.js';
import HitBoxComponent from '../utility/HitBoxComponent.js';
import Observable from '../utility/Observable.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Judgement from './judgement/Judgement.js';
import JudgementBomb from './judgement/JudgementBomb.js';
import JudgementBullet from './judgement/JudgementBullet.js';
import RandomHelper from '../utility/helper/RandomHelper.js';
import { PolarVector } from '../utility/interfaces/PolarVector.js';
import JudgementLaser from './judgement/JudgementLaser.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';

export default class EnemyFactory {
    private readonly enemyObserver: Observable;
    private readonly attackObserver: Observable;

    public constructor(eventEmitter: Observable, attackObserver: Observable) {
        this.enemyObserver = eventEmitter;
        this.attackObserver = attackObserver;
    }

    public generateCrystalSpider(position: Vector) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.CRYSTAL_SPIDER;
        const hitbox = new HitBoxComponent(-WIDTH / 2, -HEIGHT / 2, 0, 0);

        const newCrystalSpider = new CrystalSpider(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnEnemy', newCrystalSpider);
    }

    public generateCrystalBrute(position: Vector) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.CRYSTAL_BRUTE;
        const hitbox = new HitBoxComponent(30 + -WIDTH / 2, 30 + -HEIGHT / 2, 50, 30);
        const newCrystalBrute = new CrystalBrute(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnEnemy', newCrystalBrute);
    }

    public generateEnemy(position: Vector) {
        if (RandomHelper.getRandomBoolean(GameSettings.GAME.FOREST_STAGE.SPIDER_SPAWN_CHANCE)) {
            this.generateCrystalSpider(position);
            return;
        }

        this.generateCrystalBrute(position);
    }

    public generateBoss(position: Vector) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.JUDGEMENT;
        const hitbox = new HitBoxComponent(-WIDTH / 2 + 50, -HEIGHT / 2 + 75, 125, 100);
        const judgement = new Judgement(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnBoss', judgement);
    }

    public generateBossBomb(position: Vector, angle: number) {
        const { WIDTH, HEIGHT, MAX_HEALTH, OFFSET, LIFETIME } = GameSettings.GAME.ENEMY.JUDGEMENT_BOMB;
        const hitbox = new HitBoxComponent(-WIDTH / 2, -HEIGHT / 2, 0, 0);
        const pVector = new PolarVector(OFFSET, angle);
        const newPosition = new Vector(DistanceHelper.getHorizontalValue(pVector, position.x), DistanceHelper.getVerticalValue(pVector, position.y));
        const judgementBomb = new JudgementBomb(newPosition, position, OFFSET, WIDTH, HEIGHT, hitbox, MAX_HEALTH, angle, LIFETIME, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnBossEntity', judgementBomb);
    }

    public generateBossBullet(position: Vector, angle: number) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.JUDGEMENT_BULLET;

        const hitbox = new HitBoxComponent(-WIDTH / 2, -HEIGHT / 2, 0, 0);
        const lifetime = RandomHelper.randomValue(200, 200);

        const speed = RandomHelper.randomValue(5, 1);
        const velocity = new PolarVector(speed, angle);

        const judgementBullet = new JudgementBullet(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, velocity, lifetime, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnBossEntity', judgementBullet);
    }

    public generateBossLaser(position: Vector, angle: number) {
        const { WIDTH, HEIGHT, MAX_HEALTH, SPEED, MAX_LIFETIME } = GameSettings.GAME.ENEMY.JUDGEMENT_LASER;

        const hitbox = new HitBoxComponent(-WIDTH / 2, -HEIGHT / 2, 0, 0);
        const velocity = new PolarVector(SPEED, angle);

        const judgementLaser = new JudgementLaser(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, velocity, MAX_LIFETIME, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnBossEntity', judgementLaser);
    }
}
