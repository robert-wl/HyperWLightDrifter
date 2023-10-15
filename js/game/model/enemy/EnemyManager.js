import { getRandomBoolean, getRandomValue } from '../../helper/randomHelper.js';
import GameSettings from '../../constants.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import Game from '../Game/Game.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import CrystalWolf from './crystalWolf/CrystalWolf.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';

export default class EnemyManager {
    static instance = null;

    constructor() {
        this.enemyList = [];
        this.boss = null;
        this.bossEntities = [];
        this.enemySpawn = true;
        this.enemyAliveCount = 0;
        this.difficulty = 8;
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new EnemyManager();
        }
        return this.instance;
    }

    static spawnEnemy(position) {
        if (getRandomBoolean(0.7)) {
            CrystalSpider.generate(position);
            return;
        }

        CrystalBrute.generate(position);
    }

    update() {
        this.enemyList.forEach((enemy) => {
            enemy.update();
        });

        this.enemySpawnHandler();
    }

    updateBoss() {
        this.boss?.update();
    }

    updateBossEntities() {
        this.bossEntities.forEach((entity) => {
            entity.update();
        });
    }

    enemySpawnHandler() {
        if (this.difficulty === 8) {
            return;
        }

        if (!this.enemySpawn) {
            return;
        }

        if (this.enemyAliveCount > 0) {
            return;
        }

        let counter = 0;
        while (counter < this.difficulty) {
            counter += this.enemySpawner();
        }

        const { audio } = Game.getInstance();

        audio.playAudio('forest_stage/door_progress.wav', null, false, false, 0.75);
        this.difficulty += 1;
    }

    enemySpawner() {
        if (this.difficulty > 4 && getRandomBoolean(0.25)) {
            return this.crystalBruteSpawner();
        }

        if (this.difficulty > 2 && getRandomBoolean(0.5)) {
            return this.crystalWolfSpawner();
        }

        return this.crystalSpiderSpawner();
    }

    crystalBruteSpawner() {
        const { radius, angle } = this.getRandomPosition();
        CrystalBrute.generate({
            x: getHorizontalValue({
                initial: GameSettings.GAME.SCREEN_WIDTH / 2,
                magnitude: radius / 1.25,
                angle: angle,
            }),
            y: getVerticalValue({
                initial: GameSettings.GAME.SCREEN_HEIGHT / 2,
                magnitude: radius / 1.25,
                angle: angle,
            }),
        });
        this.enemyAliveCount += 3;
        return 3;
    }

    crystalWolfSpawner() {
        const { radius, angle } = this.getRandomPosition();
        CrystalWolf.generate({
            x: getHorizontalValue({
                initial: GameSettings.game.SCREEN_WIDTH / 2,
                magnitude: radius / 1,
                angle: angle,
            }),
            y: getVerticalValue({
                initial: GameSettings.game.SCREEN_HEIGHT / 2,
                magnitude: radius / 1,
                angle: angle,
            }),
        });

        this.enemyAliveCount += 1;
        return 1;
    }

    crystalSpiderSpawner() {
        for (let i = 0; i < 2; i++) {
            const { radius, angle } = this.getRandomPosition();
            CrystalSpider.generate({
                x: getHorizontalValue({
                    initial: GameSettings.game.SCREEN_WIDTH / 2,
                    magnitude: radius / 1,
                    angle: angle,
                }),
                y: getVerticalValue({
                    initial: GameSettings.game.SCREEN_HEIGHT / 2,
                    magnitude: radius / 1,
                    angle: angle,
                }),
            });
        }

        this.enemyAliveCount += 2;
        return 1;
    }

    getRandomPosition() {
        const radius = getRandomValue({
            initialValue: 750,
            randomizeValue: 500,
        });

        const angle = getRandomValue({
            initialValue: 0,
            randomValue: Math.PI * 2,
        });

        return { radius, angle };
    }

    kill(enemy) {
        this.enemyList = this.enemyList.filter((e) => e !== enemy);
    }

    killAll() {
        this.enemyList = [];
    }
}
