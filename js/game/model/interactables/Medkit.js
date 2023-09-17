import Collideable from '../collideable/Collideable.js';
import Game from '../Game/Game.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import detectPlayerInteraction from "../../helper/player/interaction/detectPlayerInteraction.js";

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
        this.number += 1;

        if (this.number === 100) {
            this.number = 0;
            this.animationStage = (this.animationStage % 2) + 1;
        }

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

    detectInteraction(){
        detectPlayerInteraction(this);
    }

    destroy() {
        const { collideables, audio } = Game.getInstance();
        audio.playAudio('player/medkit/use.wav');
        collideables.splice(collideables.indexOf(this), 1);
    }

}
