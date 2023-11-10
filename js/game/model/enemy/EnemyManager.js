import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';
import GameSettings from '../../constants.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
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
    handleDetectPoint(position, enemy, notifyData) {
        if (enemy instanceof CrystalSpider || enemy instanceof CrystalBrute) {
            if (enemy.currState == enemy.dieState)
                return false;
        }
        return this.detectCollisionPoint(position, enemy);
    }
    handleDamagePoint(position, enemy) {
        if (this.detectCollisionPoint(position, enemy)) {
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.HIT,
                angle: this.game.player.lookAngle,
            });
        }
        this.attackObserver.notify('playerHitPoint');
    }
    handleDamageBox(enemy) {
        if (this.detectCollisionBox(enemy, this.game.player)) {
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.HIT,
                angle: this.game.player.lookAngle,
            });
            this.attackObserver.notify('playerHitArea');
        }
    }
    detectCollisionPoint(position, enemy) {
        return enemy.position.x + enemy.hitbox.xOffset < position.x && enemy.position.x + enemy.width / 2 - enemy.hitbox.wOffset > position.x && enemy.position.y + enemy.hitbox.yOffset < position.y && enemy.position.y + enemy.height / 2 - enemy.hitbox.hOffset > position.y;
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
            if (event === 'spawnBossBullet') {
                this.enemyFactory.generateBossBullet(data.position, data.angle);
                return;
            }
            if (event === 'spawnBossLaser') {
                this.enemyFactory.generateBossLaser(data.position, data.angle);
            }
        });
        this.attackObserver.subscribe(({ event, data }) => {
            if (event === 'playerAttack') {
                this.enemyList.forEach((enemy) => {
                    this.handleDamageBox(enemy);
                });
                this.bossEntities.forEach((entity) => {
                    this.handleDamageBox(entity);
                });
                if (this.boss)
                    this.handleDamageBox(this.boss);
            }
            // if (event === 'gunAim') {
            //     if (this.gunAimHandler(data)) {
            //         this.attackObserver.notify('playerHit', data.length);
            //     }
            // }
        });
    }
}
