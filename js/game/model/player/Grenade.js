import Game from '../game/Game.js';
import CrystalBrute from '../enemy/crystalBrute/CrystalBrute.js';
import CrystalSpider from '../enemy/crystalSpider/CrystalSpider.js';
import Animateable from '../utility/Animateable.js';
import GameSettings from '../../constants.js';
import RandomHelper from '../utility/helper/RandomHelper.js';
import { Vector } from '../utility/interfaces/Vector.js';
import AssetManager from '../utility/manager/AssetManager.js';
import AudioManager from '../utility/manager/AudioManager.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { PolarVector } from '../utility/interfaces/PolarVector.js';
import AngleHelper from '../utility/helper/AngleHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
export default class Grenade extends Animateable {
    constructor({ x, y, w, h, angle, velocity }) {
        super();
        this.position = new Vector(x, y);
        this.width = w;
        this.height = h;
        this.angle = angle;
        this.velocity = velocity;
        this.friction = 0.03;
        this.number = 0;
        this.animationStage = 1;
        this.rotationNumber = 0;
        this.rotation = RandomHelper.randomValue(0, Math.PI * 3);
        this.playedAudio = false;
    }
    static generate({ x, y, angle }) {
        //TODO
        const newGrenade = new Grenade({
            x: x,
            y: y,
            w: 16,
            h: 16,
            angle: angle,
            velocity: 10,
        });
        Game.getInstance().player.projectiles.push(newGrenade);
    }
    update() {
        this.number += Game.deltaTime;
        if (this.animationStage <= 2) {
            this.rotationNumber += Game.deltaTime * 0.05;
        }
        const pVector = new PolarVector(this.velocity * Game.deltaTime, this.angle);
        this.position.x += DistanceHelper.getHorizontalValue(pVector);
        this.position.y += DistanceHelper.getVerticalValue(pVector);
        this.velocity = this.velocity * (1 - this.friction * Game.deltaTime);
        if (this.checkCounter(50) && this.animationStage === 1) {
            this.animationStage += 1;
            this.number = 0;
        }
        if (this.animationStage > 1) {
            this.advanceAnimationStage(2);
            this.velocity = 0;
        }
        const { player } = Game.getInstance();
        const { projectiles } = player;
        if (!this.playedAudio && this.animationStage >= 2) {
            AudioManager.playAudio('player/grenade/explode.wav');
            this.playedAudio = true;
            this.handleDamage();
        }
        if (this.animationStage >= 11) {
            projectiles.splice(projectiles.indexOf(this), 1);
            return;
        }
        this.render();
    }
    render() {
        const grenade = AssetManager.getNumberedImage('grenade', this.animationStage);
        const imageSize = Box.parse({
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2,
            w: grenade.width * GameSettings.GAME.GAME_SCALE,
            h: grenade.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawRotated(grenade, imageSize, this.rotation + this.rotationNumber);
    }
    handleDamage() {
        const { enemyManager } = Game.getInstance();
        const { enemyList, bossEntities, boss } = enemyManager;
        enemyList.forEach((enemy) => {
            if ('currState' in enemy && 'dieState' in enemy && enemy.currState === enemy.dieState) {
                return;
            }
            const distance = DistanceHelper.getMagnitude({
                x: this.position.x - enemy.position.x,
                y: this.position.y - enemy.position.y,
            });
            const angle = AngleHelper.getAngle({
                x: this.position.x - enemy.position.x,
                y: this.position.y - enemy.position.y,
            });
            if (distance >= 250) {
                return;
            }
            if (enemy instanceof CrystalSpider) {
                AudioManager.playAudio('enemy/crystal_spider/hurt.wav');
            }
            if (enemy instanceof CrystalBrute) {
                AudioManager.playAudio('enemy/crystal_brute/hurt.wav');
            }
            enemy.handleDamage({
                amount: GameSettings.PLAYER.DAMAGE.GRENADE,
                angle: -angle,
            });
        });
        bossEntities.forEach((entity) => {
            const distance = DistanceHelper.getMagnitude({
                x: this.position.x - entity.position.x,
                y: this.position.y - entity.position.y,
            });
            if (distance >= 250) {
                return;
            }
            entity.health -= GameSettings.PLAYER.DAMAGE.GRENADE;
        });
        if (!boss) {
            return;
        }
        const distance = DistanceHelper.getMagnitude({
            x: this.position.x - boss.position.x,
            y: this.position.y - boss.position.y,
        });
        if (distance >= 250) {
            return;
        }
        boss.handleDamage({
            amount: GameSettings.PLAYER.DAMAGE.GRENADE,
        });
    }
}
