import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';
export default class EnemyManager {
    constructor(attackObserver) {
        this.attackObserver = attackObserver;
        this.enemyObserver = new Observable();
        this._enemyFactory = new EnemyFactory(this.enemyObserver, this.attackObserver);
        this._enemyList = [];
        this._boss = null;
        this._bossEntities = [];
        this.eventHandler();
    }
    get boss() {
        return this._boss;
    }
    set boss(value) {
        this._boss = value;
    }
    get bossEntities() {
        return this._bossEntities;
    }
    set bossEntities(value) {
        this._bossEntities = value;
    }
    get enemyList() {
        return this._enemyList;
    }
    set enemyList(value) {
        this._enemyList = value;
    }
    get enemyFactory() {
        return this._enemyFactory;
    }
    clearEntities() {
        this._enemyList = [];
    }
    updateBoss() {
        var _a;
        (_a = this._boss) === null || _a === void 0 ? void 0 : _a.update();
    }
    updateBossEntities() {
        this._bossEntities.forEach((entity) => {
            entity.update();
        });
    }
    eventHandler() {
        this.enemyObserver.subscribe(({ event, data }) => {
            if (event === 'spawnEnemy') {
                this._enemyList.push(data);
            }
        });
    }
}
