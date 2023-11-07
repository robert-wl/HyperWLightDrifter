import Enemy from './Enemy.js';
import Judgement from './judgement/Judgement.js';
import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';

export default class EnemyManager {
    private readonly eventEmitter: Observable;
    private enemyList: Enemy[];
    private boss: Judgement;
    private bossEntities: Enemy[];
    private _enemyFactory: EnemyFactory;

    public constructor() {
        this.eventEmitter = new Observable();
        this._enemyFactory = new EnemyFactory(this.eventEmitter);
        this.enemyList = [];
        this.boss = null;
        this.bossEntities = [];

        this.eventHandler();
    }

    get enemyFactory(): EnemyFactory {
        return this._enemyFactory;
    }

    public clearEntities() {
        this.enemyList = [];
    }

    public updateBoss() {
        this.boss?.update();
    }

    public updateBossEntities() {
        this.bossEntities.forEach((entity) => {
            entity.update();
        });
    }

    private eventHandler() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'spawnEnemy') {
                this.enemyList.push(data);
            }
        });
    }
}
