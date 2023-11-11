import Animateable from '../utility/Animateable.js';
import GameSettings from '../../constants.js';
import AssetManager from '../utility/manager/AssetManager.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
import AudioManager from '../utility/manager/AudioManager.js';
export default class Coin extends Animateable {
    constructor(position, width, height, key, interactableEventEmitter) {
        super();
        this._position = position;
        this.width = width;
        this.height = height;
        this.key = key;
        this.interactableEventEmitter = interactableEventEmitter;
        this.interactionDistance = GameSettings.PLAYER.INTERACTION_MAX_DISTANCE;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
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
        const medKit = AssetManager.getNumberedImage('keys', this.animationStage);
        const imageSize = Box.parse({
            x: this._position.x,
            y: this._position.y,
            w: medKit.width * GameSettings.GAME.GAME_SCALE,
            h: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImage(medKit, imageSize);
    }
    detectInteraction(position) {
        const distance = DistanceHelper.getMagnitude({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        });
        return distance < this.interactionDistance;
    }
    activate() {
        AudioManager.playAudio('player_key_pickup_audio').then();
        this.interactableEventEmitter.notify('coin:collected', this.key);
    }
}
