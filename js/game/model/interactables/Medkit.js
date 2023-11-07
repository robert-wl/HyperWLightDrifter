import Game from '../game/Game.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import InteractionBar from './InteractionBar.js';
import Animateable from '../utility/Animateable.js';
import Collider from '../collideable/Collider.js';
export default class Medkit extends Animateable {
    constructor(position, width, height, key) {
        super();
        this.position = position;
        this.width = width;
        this.height = height;
        this.collider = new Collider({
            x: position.x,
            y: position.y,
            width,
            height,
        });
        this.key = key;
        this.interactionStage = 1;
    }
    static generate(position, key) { }
    update() {
        this.updateNumberCounter();
        this.advanceAnimationStage(100, 2);
        this.render();
    }
    render() {
        const medKit = getNumberedImage('medkit', this.animationStage);
        drawImage({
            img: medKit,
            x: this.position.x,
            y: this.position.y,
            width: medKit.width * GameSettings.GAME.GAME_SCALE,
            height: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
    }
    detectInteraction() {
        InteractionBar.detectPlayerInteraction(this);
    }
    activate() {
        const { interactables, audio } = Game.getInstance();
        audio.playAudio('player/medkit/use.wav');
        interactables.splice(interactables.indexOf(this), 1);
        const setPiece = Game.getInstance().objects.get(this.key);
        setPiece.pieces.splice(setPiece.pieces.indexOf(this), 1);
    }
}
