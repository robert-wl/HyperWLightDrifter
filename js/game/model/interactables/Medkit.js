import Collideable from '../collideable/Collideable.js';
import Game from '../Game/Game.js';
import { get_image } from '../../helper/fileReader.js';
import handleInteractionBar from './handleInteractionBar.js';

export default class Medkit extends Collideable {
    static generate({ x, y }) {
        const newMedkit = new Medkit({
            x,
            y,
            w: 10,
            h: 0,
            collideable: true,
        });

        Game.getInstance().collideables.push(newMedkit);
    }
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.number = 0;
        this.animationStage = 1;
        this.interactionStage = 1;
    }

    update() {
        super.update();
        this.number++;

        if (this.number === 100) {
            this.number = 0;
            this.animationStage = (this.animationStage % 2) + 1;
        }
        this.render();
        this.detectPlayerInteraction();
    }

    render() {
        const ctx = Game.getInstance().ctx;
        get_image('other/medkit', 'medkit', this.animationStage, (image) => {
            ctx.drawImage(image, this.x, this.y, 25, 25);
        });
    }

    detectPlayerInteraction() {
        const player = Game.getInstance().player;
        const distance = Math.sqrt(
            Math.pow(player.position.x + player.width / 2 - (this.x + this.width / 2), 2) +
            Math.pow(player.position.y + player.height / 2 - (this.y + this.height / 2), 2)
        );

        if (distance < 100) {
            if (
                handleInteractionBar({
                    medkit: this,
                    opacity: Math.abs(distance - 100) / 100,
                })
            ) {
                Game.getInstance().collideables.splice(Game.getInstance().collideables.indexOf(this), 1);
            }
        } else {
            Game.getInstance().player.interactionStage = 0;
        }
    }
}
