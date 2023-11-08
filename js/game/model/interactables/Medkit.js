import Game from '../game/Game.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import Animateable from '../utility/Animateable.js';
import Collider from '../collideable/Collider.js';
import { getMagnitudeValue } from '../../helper/distanceHelper.js';
export default class Medkit extends Animateable {
    constructor(position, width, height, key, interactableEventEmitter) {
        super();
        this._position = position;
        this.width = width;
        this.height = height;
        this._collider = new Collider({
            x: position.x,
            y: position.y,
            width,
            height,
        });
        this.interactableEventEmitter = interactableEventEmitter;
        this._key = key;
        this.interactionDistance = GameSettings.PLAYER.INTERACTION_MAX_DISTANCE;
    }
    get key() {
        return this._key;
    }
    set key(value) {
        this._key = value;
    }
    get collider() {
        return this._collider;
    }
    set collider(value) {
        this._collider = value;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
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
            x: this._position.x,
            y: this._position.y,
            width: medKit.width * GameSettings.GAME.GAME_SCALE,
            height: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
    }
    detectInteraction(position) {
        const distance = getMagnitudeValue({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        });
        return distance < this.interactionDistance;
    }
    activate(player) {
        const { audio } = Game.getInstance();
        player.healing = 6;
        player.healthPack += 1;
        player.healthPack = Math.min(player.healthPack, 3);
        audio.playAudio('player/medkit/use.wav');
        this.interactableEventEmitter.notify('medkitCollected', this);
    }
}
