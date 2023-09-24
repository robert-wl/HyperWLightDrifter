import Collideable from '../collideable/Collideable.js';
import Game from '../Game/Game.js';
import GameSettings from '../../constants.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import InteractionBar from './InteractionBar.js';

export default class Door extends Collideable {
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.isLocked = true;
        this.number = 0;
        this.animationStage = 1;
        this.interactionStage = 1;
        this.openingStage = 0;
    }

    static generate({ x, y, collideable }) {
        const newDoor = new Door({
            x,
            y,
            w: 104,
            h: 0,
            collideable,
        });
        Game.getInstance().collideables.push(newDoor);
    }

    update() {
        const { enemyManager, audio } = Game.getInstance();

        if (enemyManager.difficulty >= 8) {
            this.isLocked = false;
        }

        if (this.openingStage > 0) {
            this.updateAnimationCounter();

            if (this.checkCounter(5)) {
                this.openingStage += 1;
            }

            if (this.checkCounter(4) && this.openingStage === 1) {
                audio.playAudio('forest_stage/door_activate.ogg');
            }
        }

        if (this.openingStage >= 4) {
            const { collideables } = Game.getInstance();
            collideables.splice(collideables.indexOf(this), 1);
        }

        this.render();
    }

    render() {
        const { enemyManager } = Game.getInstance();

        let imageNumber = 1;
        if (this.isLocked) {
            imageNumber = enemyManager.difficulty;
        } else {
            imageNumber = 9 + this.openingStage;
        }

        const door = getNumberedImage('door', imageNumber);

        drawImage({
            img: door,
            x: this.x,
            y: this.y,
            width: door.width * GameSettings.GAME.GAME_SCALE,
            height: door.height * GameSettings.GAME.GAME_SCALE,
        });
    }

    detectInteraction() {
        if (this.isLocked || this.openingStage > 0) {
            return;
        }

        InteractionBar.detectPlayerInteraction(this);
    }

    activate() {
        this.openingStage = 1;
    }
}
