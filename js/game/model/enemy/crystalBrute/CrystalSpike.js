import { get_image } from '../../../helper/fileReader.js';
import Game from '../../Game.js';
import { drawMirroredY } from '../../../helper/renderer/drawer.js';

export default class CrystalSpike {
    static generate({ position }) {
        return new CrystalSpike({ position });
    }
    constructor({ position }) {
        this.position = position;
        this.width = 27 * 2;
        this.height = 45 * 2;
        this.number = 0;
        this.animationStage = 0;
        this.left = Math.random() > 0.5;
    }

    update() {
        this.number++;

        if ((this.number === 30 && this.animationStage === 5) || (this.number === 5 && (this.animationStage < 5 || this.animationStage === 6))) {
            this.animationStage++;
            this.number = 0;
        }
        if (this.animationStage === 7) {
            return this;
        }
        this.render();
    }

    render() {
        const ctx = Game.getInstance().canvasCtx;
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
