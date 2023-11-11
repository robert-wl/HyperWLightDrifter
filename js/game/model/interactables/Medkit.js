import GameSettings from '../../constants.js';
import Animateable from '../utility/Animateable.js';
import Collider from '../collideable/Collider.js';
import AssetManager from '../utility/manager/AssetManager.js';
import AudioManager from '../utility/manager/AudioManager.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
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
        const medKit = AssetManager.getNumberedImage('medkit', this.animationStage);
        const imageSize = Box.parse({
            x: this.position.x,
            y: this.position.y,
            w: medKit.width * GameSettings.GAME.GAME_SCALE,
            h: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(medKit, imageSize, false);
    }
    detectInteraction(position) {
        const distance = DistanceHelper.getMagnitude({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        });
        return distance < this.interactionDistance;
    }
    activate(player) {
        player.healing = 6;
        player.healthPack += 1;
        player.healthPack = Math.min(player.healthPack, 3);
        AudioManager.playAudio('player_medkit_use_audio');
        this.interactableEventEmitter.notify('medkit:collected', this);
    }
}
