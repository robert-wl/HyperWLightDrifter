import EnemyManager from '../../enemy/EnemyManager.js';
import { Vector } from '../interfaces/Vector.js';

export default class GunHelper {
    private static enemyManager: EnemyManager;

    private constructor() {
        //
    }

    public static setEnemyManager(enemyManager: EnemyManager) {
        this.enemyManager = enemyManager;
    }

    public static checkTargetPosition(position: Vector) {
        for (const enemy of this.enemyManager.enemyList) {
            if (this.enemyManager.handleDetectPoint(position, enemy)) {
                return true;
            }
        }

        for (const entity of this.enemyManager.bossEntities) {
            if (this.enemyManager.handleDetectPoint(position, entity)) {
                return true;
            }
        }

        if (this.enemyManager.boss)
            if (this.enemyManager.handleDetectPoint(position, this.enemyManager.boss)) {
                return true;
            }

        return false;
    }

    public static damageTargetPosition(position: Vector) {
        for (const enemy of this.enemyManager.enemyList) {
            this.enemyManager.handleDamagePoint(position, enemy);
        }

        for (const entity of this.enemyManager.bossEntities) {
            this.enemyManager.handleDamagePoint(position, entity);
        }

        if (this.enemyManager.boss) this.enemyManager.handleDamagePoint(position, this.enemyManager.boss);
    }

    //
}
