import Enemy from './Enemy.js';
import Judgement from './judgement/Judgement.js';
import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';

export default class EnemyManager {
    private readonly attackObserver: Observable;
    private readonly enemyObserver: Observable;
    private _enemyList: Enemy[];
    private _boss: Judgement;
    private _bossEntities: Enemy[];
    private _enemyFactory: EnemyFactory;

    public constructor(attackObserver: Observable) {
        this.attackObserver = attackObserver;
        this.enemyObserver = new Observable();
        this._enemyFactory = new EnemyFactory(this.enemyObserver, this.attackObserver);
        this._enemyList = [];
        this._boss = null;
        this._bossEntities = [];

        this.eventHandler();
    }

    get boss(): Judgement {
        return this._boss;
    }

    set boss(value: Judgement) {
        this._boss = value;
    }

    get bossEntities(): Enemy[] {
        return this._bossEntities;
    }

    set bossEntities(value: Enemy[]) {
        this._bossEntities = value;
    }

    get enemyList(): Enemy[] {
        return this._enemyList;
    }

    set enemyList(value: Enemy[]) {
        this._enemyList = value;
    }

    get enemyFactory(): EnemyFactory {
        return this._enemyFactory;
    }

    public clearEntities() {
        this._enemyList = [];
    }

    public updateBoss() {
        this._boss?.update();
    }

    public updateBossEntities() {
        this._bossEntities.forEach((entity) => {
            entity.update();
        });
    }

    private eventHandler() {
        this.enemyObserver.subscribe(({ event, data }) => {
            if (event === 'spawnEnemy') {
                this._enemyList.push(data);
            }
        });
    }
}
