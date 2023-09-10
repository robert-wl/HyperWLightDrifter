import { get_image } from '../../../helper/fileReader.js';
import Game from '../../Game/Game.js';
import { drawMirroredY } from '../../../helper/renderer/drawer.js';
import playerCollision from "../../../helper/collision/playerCollision.js";

export default class CrystalSpike {
    static generate({ position }) {
        return new CrystalSpike({ position });
    }
    constructor({ position }) {
        this.position = position;
        this.hitbox = {
            x: 10,
            y: 10,
            w: 20,
            h: 20,
        }
        this.width = 27 * 2;
        this.height = 45 * 2;
        this.number = 0;
        this.animationStage = 0;
        this.left = Math.random() > 0.5;
        this.damaged = false;
    }

    update() {
        this.number++;

        if(!this.damaged) {
            if(playerCollision({
                box: {
                    x: this.position.x + this.hitbox.x,
                    y: this.position.y + this.hitbox.y,
                    w: this.width - this.hitbox.w,
                    h: this.height - this.hitbox.h,
                }
            })) {
                this.damaged = true;
            }
        }
        if (
            (this.number === 30 && this.animationStage === 5) ||
            (this.number === 5 && (this.animationStage < 5 || this.animationStage === 6))
        ) {
            this.animationStage++;
            this.number = 0;
        }
        if (this.animationStage === 7) {
            return this;
        }
        this.render();
    }

    render() {
        if(Game.getInstance().debug) {
            const ctx = Game.getInstance().ctx;
            ctx.fillStyle = "red";
            ctx.fillRect(
                this.position.x + this.hitbox.x,
                this.position.y + this.hitbox.y,
                this.width - this.hitbox.w,
                this.height - this.hitbox.h
            );
        }

        const ctx = Game.getInstance().ctx;
        get_image('enemy/crystal_brute', 'crystal_spike', this.animationStage + 1, (image) => {
            if (this.left) {
                drawMirroredY({
                    canvas: ctx,
                    img: image,
                    position: this.position,
                    width: this.width,
                    height: this.height,
                });
            } else {
                ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height);
            }
        });
    }
}
