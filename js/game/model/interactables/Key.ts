import Animateable from '../utility/Animateable.js';
import { getNumberedImage } from '../../helper/assets/assetGetter.js';
import { drawImage } from '../../helper/renderer/drawer.js';
import GameSettings from '../../constants.js';
import { Vector } from '../utility/enums/Vector.js';
import { getMagnitudeValue } from '../../helper/distanceHelper.js';
import Observable from '../utility/Observable.js';

export default class Key extends Animateable {
    private _position: Vector;
    private width: number;
    private height: number;
    private key: string;
    private interactableEventEmitter: Observable;
    private interactionDistance: number;

    constructor(position: Vector, width: number, height: number, key: string, interactableEventEmitter: Observable) {
        super();
        this._position = position;
        this.width = width;
        this.height = height;
        this.key = key;
        this.interactableEventEmitter = interactableEventEmitter;
        this.interactionDistance = GameSettings.PLAYER.INTERACTION_MAX_DISTANCE;
    }

    get position(): Vector {
        return this._position;
    }

    set position(value: Vector) {
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
        const medKit = getNumberedImage('keys', this.animationStage);

        drawImage({
            img: medKit,
            x: this._position.x,
            y: this._position.y,
            width: medKit.width * GameSettings.GAME.GAME_SCALE,
            height: medKit.height * GameSettings.GAME.GAME_SCALE,
        });
    }

    detectInteraction(position: Vector) {
        const distance = getMagnitudeValue({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        });

        return distance < this.interactionDistance;
    }

    activate() {
        this.interactableEventEmitter.notify('keyCollected', this.key);
    }
}
