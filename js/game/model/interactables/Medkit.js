import Game from '../Game/Game.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import InteractionBar from './InteractionBar.js';
import Animateable from '../Animateable.js';
import Collider from '../collideable/Collider.js';
import { getRandomValue } from '../../helper/randomHelper.js';

export default class Medkit extends Animateable {
    constructor({ position, width, height, key }) {
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

    static generate(position, key) {
        const angle =
            getRandomValue({
                initialValue: 0,
                randomValue: 4,
            }) * Math.PI;

        position = {
            x: position.x + Math.cos(angle) * 100,
            y: position.y + Math.sin(angle) * 100,
        };

        return new Medkit({
            position: position,
            width: 10,
            height: 10,
            key,
        });
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
