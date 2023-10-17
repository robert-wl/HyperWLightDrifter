import { getRandomBoolean } from '../../helper/randomHelper.js';
import GameSettings from '../../constants.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';

export default class EnemyManager {
    static instance = null;

    constructor() {
        this.enemyList = [];
        this.boss = null;
        this.bossEntities = [];
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new EnemyManager();
        }
        return this.instance;
    }

    static spawnEnemy(position) {
        if (getRandomBoolean(GameSettings.GAME.FOREST_STAGE.SPIDER_SPAWN_CHANCE)) {
            CrystalSpider.generate(position);
            return;
        }

        CrystalBrute.generate(position);
    }

    clearEntities() {
        this.enemyList = [];
    }

    updateBoss() {
        this.boss?.update();
    }

    updateBossEntities() {
        this.bossEntities.forEach((entity) => {
            entity.update();
        });
    }
}
