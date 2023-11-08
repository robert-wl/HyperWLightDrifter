import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import GameSettings from '../../constants.js';
export default class EnemyManager {
    constructor(game) {
        this.game = game;
        this.attackObserver = game.player.attackObserver;
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
    handleDamageBox(enemy) {
        if (!(enemy instanceof CrystalSpider) && !(enemy instanceof CrystalBrute)) {
            return;
        }
        if (enemy.currState === enemy.dieState) {
            return;
        }
        if (this.detectCollisionBox(enemy, this.game.player)) {
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.HIT,
                angle: this.game.player.lookAngle,
            });
        }
        // for (const entity of this.bossEntities) {
        //     if (entity.currState === entity.dieState) {
        //         continue;
        //     }
        //
        //     if (entity.position.x + entity.hitbox.x < position.x && entity.position.x + entity.width / 2 - entity.hitbox.w > position.x && entity.position.y + entity.hitbox.y < position.y && entity.position.y + entity.height / 2 - entity.hitbox.h > position.y) {
        //         return entity;
        //     }
        // }
        //
        // if (this.boss) {
        //     if (boss.currState === boss.deathState || boss.currState === boss.bombState) {
        //         return null;
        //     }
        //
        //     if (boss.position.x + boss.hitbox.x < position.x && boss.position.x + boss.width / 2 - boss.hitbox.w > position.x && boss.position.y + boss.hitbox.y < position.y && boss.position.y + boss.height / 2 - boss.hitbox.h > position.y) {
        //         return boss;
        //     }
        // }
    }
    detectCollision(positionOne, positionTwo, hitbox, width, height) {
        return positionOne.x + hitbox.xOffset < positionTwo.x && positionOne.x + width - hitbox.wOffset > positionTwo.x && positionOne.y + hitbox.yOffset < positionTwo.y && positionOne.y + height - hitbox.hOffset > positionTwo.y;
    }
    detectCollisionBox(enemy, player) {
        const enemyX1 = enemy.position.x + enemy.hitbox.xOffset;
        const enemyX2 = enemy.position.x + enemy.hitbox.xOffset + enemy.width - enemy.hitbox.wOffset;
        const enemyY1 = enemy.position.y + enemy.hitbox.yOffset;
        const enemyY2 = enemy.position.y + enemy.hitbox.yOffset + enemy.height - enemy.hitbox.hOffset;
        const playerX1 = player.attackBox.x;
        const playerX2 = player.attackBox.x + player.attackBox.w;
        const playerY1 = player.attackBox.y;
        const playerY2 = player.attackBox.y + player.attackBox.h;
        return enemyX1 < playerX2 && enemyX2 > playerX1 && enemyY1 < playerY2 && enemyY2 > playerY1;
    }
    eventHandler() {
        this.enemyObserver.subscribe(({ event, data }) => {
            if (event === 'spawnEnemy') {
                this._enemyList.push(data);
                return;
            }
            if (event === 'spawnBoss') {
                this._boss = data;
                return;
            }
            if (event === 'spawnBossEntity') {
                this._bossEntities.push(data);
                return;
            }
            if (event === 'spawnKey') {
                this.game.interactablesFactory.generateKey(data);
                return;
            }
            if (event === 'clearEnemy') {
                this._enemyList.splice(this._enemyList.indexOf(data), 1);
                return;
            }
            if (event === 'clearBossEntity') {
                this._bossEntities.splice(this._bossEntities.indexOf(data), 1);
                return;
            }
            if (event === 'spawnBossBomb') {
                this.enemyFactory.generateBossBomb(data.position, data.angle);
                return;
            }
        });
        this.attackObserver.subscribe(({ event, data }) => {
            if (event === 'playerAttack') {
                this.enemyList.forEach((enemy) => {
                    this.handleDamageBox(enemy);
                });
            }
        });
    }
}
