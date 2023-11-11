export default class GunHelper {
    static setEnemyManager(enemyManager) {
        this.enemyManager = enemyManager;
    }
    static checkTargetPosition(position) {
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
    static damageTargetPosition(position) {
        for (const enemy of this.enemyManager.enemyList) {
            this.enemyManager.handleDamagePoint(position, enemy);
        }
        for (const entity of this.enemyManager.bossEntities) {
            this.enemyManager.handleDamagePoint(position, entity);
        }
        if (this.enemyManager.boss)
            this.enemyManager.handleDamagePoint(position, this.enemyManager.boss);
    }
}
