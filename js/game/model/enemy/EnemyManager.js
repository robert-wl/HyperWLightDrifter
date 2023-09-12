import { getRandomBoolean, getRandomValue } from '../../helper/randomHelper.js';
import GameSettings from '../../constants.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';

export default class EnemyManager {
    static instance = null;
    constructor() {
        this.enemyList = [];
        this.enemySpawn = true;
        this.enemyAliveCount = 0;
        this.difficulty = 5;
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new EnemyManager();
        }
        return this.instance;
    }

    update() {
        this.enemyList.forEach((enemy) => {
            enemy.update();
        });

        this.enemySpawnHandler();
    }

    enemySpawnHandler() {
        if (!this.enemySpawn) {
            return;
        }

        if (this.enemyAliveCount > 0) {
            return;
        }

        for (let i = 0; i <= this.difficulty; i++) {
            const radius = getRandomValue({
                initialValue: 750,
                randomizeValue: 500,
            });

            const angle = getRandomValue({
                initialValue: 0,
                randomValue: Math.PI * 2,
            });

            console.log(angle);

            if (this.difficulty > 5 && getRandomBoolean(0.25) || true) {
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
                i += 5;
                this.enemyAliveCount += 5;
                continue;
            }

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

            this.enemyAliveCount += 1;
        }

        this.difficulty += 3;
    }

    kill(enemy) {
        this.enemyList = this.enemyList.filter((e) => e !== enemy);
    }

    killAll() {
        this.enemyList = [];
    }
}
