import Game from '../../game/Game.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import playerCollision from '../../../helper/collision/playerCollision.js';
import { getRandomBoolean } from '../../../helper/randomHelper.js';
import GameSettings from '../../../constants.js';
import Animateable from '../../Animateable.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';

export default class CrystalSpike extends Animateable {
    constructor({ position }) {
        super();
        this.position = position;
        this.width = 27 * 2;
        this.height = 45 * 2;
        this.hitbox = {
            x: -this.width / 2,
            y: -this.height / 2,
            w: 0,
            h: 0,
        };
        this.left = getRandomBoolean(0.5);
        this.damaged = false;
    }

    static generate({ position }) {
        return new CrystalSpike({ position });
    }

    update() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;

        if (!this.damaged) {
            this.damaged = this.handlePlayerCollision();
        }

        this.advanceAnimationStage(5);

        if (this.animationStage >= 12) {
            return this;
        }

        this.render();
        this.handleDebug();

        return null;
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
            mirrored: this.left,
        });
    }

    handlePlayerCollision() {
        return !!playerCollision({
            box: {
                x: this.position.x + this.hitbox.x,
                y: this.position.y + this.hitbox.y,
                w: this.width - this.hitbox.w,
                h: this.height - this.hitbox.h,
            },
        });
    }

    handleDebug() {
        if (Game.getInstance().debug) {
            const { ctx } = Game.getInstance();
            ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
            ctx.fillRect(this.position.x + this.hitbox.x, this.position.y + this.hitbox.y, this.width - this.hitbox.w, this.height - this.hitbox.h);
        }
    }
}
