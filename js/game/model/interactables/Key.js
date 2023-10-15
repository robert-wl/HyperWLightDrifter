import Animateable from '../Animateable.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import InteractionBar from './InteractionBar.js';
import Game from '../Game/Game.js';
import SetPiece from '../map/setPieces/SetPiece.js';

export default class Key extends Animateable {
    constructor({ position, width, height, key }) {
        super();
        this.position = position;
        this.width = width;
        this.height = height;
        this.key = key;
        this.interactionStage = 1;
    }

    static generate(position) {
        const x = Math.round(position.x / 256);
        const y = Math.round(position.y / 256);
        const key = `${y},${x}`;

        const keyObject = new Key({
            position: position,
            width: 10,
            height: 10,
            key,
        });

        const { objects } = Game.getInstance();

        if (objects.has(key)) {
            objects.get(key).pieces.push(keyObject);
            console.log(objects.get(key).pieces);
            return;
        }
        objects.set(key, new SetPiece([keyObject], 'key'));
    }

    update() {
        this.updateNumberCounter();

        if (this.animationStage === 1) {
            this.advanceAnimationStage(25);
        }
        if (this.animationStage > 1) {
            this.advanceAnimationStage(5);
        }
        if (this.animationStage === 7) {
            this.animationStage = 1;
        }

        this.render();
    }

    render() {
        const medKit = getNumberedImage('keys', this.animationStage);

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
        // audio.playAudio('player/medkit/use.wav');
        interactables.splice(interactables.indexOf(this), 1);

        const setPiece = Game.getInstance().objects.get(this.key);
        setPiece.pieces.splice(setPiece.pieces.indexOf(this), 1);
    }
}
