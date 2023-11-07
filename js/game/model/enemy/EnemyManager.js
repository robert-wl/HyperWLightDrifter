import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';
export default class EnemyManager {
    constructor() {
        this.eventEmitter = new Observable();
        this._enemyFactory = new EnemyFactory(this.eventEmitter);
        this.enemyList = [];
        this.boss = null;
        this.bossEntities = [];
        this.eventHandler();
    }
    get enemyFactory() {
        return this._enemyFactory;
    }
    clearEntities() {
        this.enemyList = [];
    }
    updateBoss() {
        var _a;
        (_a = this.boss) === null || _a === void 0 ? void 0 : _a.update();
    }
    updateBossEntities() {
        this.bossEntities.forEach((entity) => {
            entity.update();
        });
    }
    eventHandler() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'spawnEnemy') {
                this.enemyList.push(data);
            }
        });
    }
}
