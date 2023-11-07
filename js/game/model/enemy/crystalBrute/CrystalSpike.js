import Game from '../../game/Game.js';
import HitBoxComponent from '../../utility/HitBoxComponent.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import playerCollision from '../../../helper/collision/playerCollision.js';
import { getRandomBoolean } from '../../../helper/randomHelper.js';
import GameSettings from '../../../constants.js';
import Animateable from '../../utility/Animateable.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';
export default class CrystalSpike extends Animateable {
    constructor(position) {
        super();
        this.position = Object.assign({}, position);
        this.isLeft = getRandomBoolean(0.5);
        this.damaged = false;
        const { WIDTH, HEIGHT } = GameSettings.GAME.ENEMY.CRYSTAL_BRUTE.CRYSTAL_SPIKE;
        this.width = WIDTH;
        this.height = HEIGHT;
        this.hitbox = new HitBoxComponent(-this.width / 2, -this.height / 2, 0, 0);
    }
    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
        if (!this.damaged) {
            this.damaged = this.handlePlayerCollision();
        }
        if (this.animationStage >= 12) {
            return;
        }
        this.render();
        this.handleDebug();
        this.advanceAnimationStage(5);
    }
    isPastLifetime() {
        return this.animationStage >= 120;
    }
    render() {
        const crystalSpike = getNumberedImage('crystal_spike', this.animationStage);
        drawImage({
            img: crystalSpike,
            x: this.position.x,
            y: this.position.y,
            width: crystalSpike.width * GameSettings.GAME.GAME_SCALE,
            height: crystalSpike.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: this.isLeft,
        });
    }
    handlePlayerCollision() {
        return !!playerCollision({
            box: this.hitbox.getPoints(this.position, this.width, this.height),
        });
    }
    handleDebug() {
        if (Game.getInstance().debug) {
            const { ctx } = Game.getInstance();
            ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
            const { x, y, w, h } = this.hitbox.getPoints(this.position, this.width, this.height);
            ctx.fillRect(x, y, w, h);
        }
    }
}
