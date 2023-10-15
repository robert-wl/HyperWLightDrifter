import Collider from '../collideable/Collider.js';
import Game from '../Game/Game.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import InteractionBar from './InteractionBar.js';

export default class Medkit extends Collider {
    constructor({ x, y, w, h, collideable }) {
        super({ x, y, w, h, collideable });
        this.number = 0;
        this.animationStage = 1;
        this.interactionStage = 1;
    }

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

    update() {
        this.updateNumberCounter();

        this.advanceAnimationStage(100, 2);

        this.render();
    }

    render() {
        const medKit = getNumberedImage('medkit', this.animationStage);

        drawImage({
            img: medKit,
            x: this.x,
            y: this.y,
            width: medKit.width * GameSettings.GAME.GAME_SCALE,
            height: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
    }

    detectInteraction() {
        InteractionBar.detectPlayerInteraction(this);
    }

    activate() {
        const { collideables, audio } = Game.getInstance();
        audio.playAudio('player/medkit/use.wav');
        collideables.splice(collideables.indexOf(this), 1);
    }
}
