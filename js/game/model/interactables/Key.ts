import Animateable from '../utility/Animateable.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import InteractionBar from './InteractionBar.js';
import Game from '../game/Game.js';

export default class Key extends Animateable {
    private position: Position;
    private width: number;
    private height: number;
    private key: string;
    private interactionStage: number;

    constructor(position: Position, width: number, height: number, key: string) {
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

        const keyObject = new Key(position, 10, 10, key);

        const { coins } = Game.getInstance();
        coins.push(keyObject);
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
        const { interactables, coins } = Game.getInstance();
        // audio.playAudio('player/medkit/use.wav');
        interactables.splice(interactables.indexOf(this), 1);

        coins.splice(coins.indexOf(this), 1);
    }
}
