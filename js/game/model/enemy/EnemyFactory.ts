import CrystalSpider from './crystalSpider/CrystalSpider.js';
import GameSettings from '../../constants.js';
import HitBoxComponent from '../utility/HitBoxComponent.js';
import Observable from '../utility/Observable.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import { getRandomBoolean } from '../../helper/randomHelper.js';
import { Vector } from '../utility/enums/Vector.js';
import Judgement from './judgement/Judgement.js';
import JudgementBomb from './judgement/JudgementBomb.js';

export default class EnemyFactory {
    private enemyObserver: Observable;
    private attackObserver: Observable;

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
        if (getRandomBoolean(GameSettings.GAME.FOREST_STAGE.SPIDER_SPAWN_CHANCE)) {
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
        const judgementBomb = new JudgementBomb(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH, angle, OFFSET, LIFETIME, this.enemyObserver, this.attackObserver);

        this.enemyObserver.notify('spawnBossEntity', judgementBomb);
    }
}
