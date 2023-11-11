import Enemy from './Enemy.js';
import Judgement from './judgement/Judgement.js';
import Observable from '../utility/Observable.js';
import EnemyFactory from './EnemyFactory.js';
import Game from '../game/Game.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Player from '../player/Player.js';
import GameSettings from '../../constants.js';
import CrystalSpider from './crystalSpider/CrystalSpider.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';

export default class EnemyManager {
    private readonly game: Game;
    private readonly attackObserver: Observable;
    private readonly enemyObserver: Observable;
    private _enemyList: Enemy[];
    private _boss: Judgement | null;
    private readonly _bossEntities: Enemy[];
    private readonly _enemyFactory: EnemyFactory;

    public constructor(game: Game) {
        this.game = game;
        this.attackObserver = game.player.attackObserver;
        this.enemyObserver = new Observable();
        this._enemyFactory = new EnemyFactory(this.enemyObserver, this.attackObserver);
        this._enemyList = [];
        this._boss = null;
        this._bossEntities = [];

        this.eventHandler();
    }

    get boss(): Judgement | null {
        return this._boss;
    }

    get bossEntities(): Enemy[] {
        return this._bossEntities;
    }

    get enemyList(): Enemy[] {
        return this._enemyList;
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

    public handleDetectPoint(position: Vector, enemy: Enemy) {
        if (enemy instanceof CrystalSpider || enemy instanceof CrystalBrute) {
            if (enemy.currState == enemy.dieState) return false;
        }
        return this.detectCollisionPoint(position, enemy);
    }

    public handleDamagePoint(position: Vector, enemy: Enemy) {
        if (this.detectCollisionPoint(position, enemy)) {
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.HIT,
                angle: this.game.player.lookAngle,
            });
        }
        this.attackObserver.notify('playerHitPoint');
    }

    private handleDamageBox(enemy: Enemy | Judgement) {
        if (this.detectCollisionBox(enemy, this.game.player)) {
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.HIT,
                angle: this.game.player.lookAngle,
            });
            this.attackObserver.notify('playerHitArea');
        }
    }

    private detectCollisionPoint(position: Vector, enemy: Enemy) {
        return enemy.position.x + enemy.hitbox.xOffset < position.x && enemy.position.x + enemy.width / 2 - enemy.hitbox.wOffset > position.x && enemy.position.y + enemy.hitbox.yOffset < position.y && enemy.position.y + enemy.height / 2 - enemy.hitbox.hOffset > position.y;
    }

    private detectCollisionBox(enemy: Enemy, player: Player) {
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

    private eventHandler() {
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
            if (event === 'spawnCoin') {
                this.game.interactablesFactory.generateCoin(data);
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

        this.attackObserver.subscribe(({ event }) => {
            if (event === 'playerAttack') {
                this.enemyList.forEach((enemy) => {
                    this.handleDamageBox(enemy);
                });
                this.bossEntities.forEach((entity) => {
                    this.handleDamageBox(entity);
                });
                if (this.boss) this.handleDamageBox(this.boss);
            }
        });
    }
}
