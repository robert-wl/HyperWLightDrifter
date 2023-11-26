import GameSettings from '../../constants.js';
import Animateable from '../utility/Animateable.js';
import Collider from '../collideable/Collider.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Player from '../player/Player.js';
import Observable from '../utility/Observable.js';
import AssetManager from '../utility/manager/AssetManager.js';
import AudioManager from '../utility/manager/AudioManager.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';

export default class Medkit extends Animateable {
    private _position: Vector;
    private readonly width: number;
    private readonly height: number;
    private _collider: Collider;
    private _key: string;
    private interactableEventEmitter: Observable;
    private readonly interactionDistance: number;

    constructor(position: Vector, width: number, height: number, key: string, interactableEventEmitter: Observable) {
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

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get collider(): Collider {
        return this._collider;
    }

    set collider(value: Collider) {
        this._collider = value;
    }

    get position(): Vector {
        return this._position;
    }

    set position(value: Vector) {
        this._position = value;
    }

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

    public detectInteraction(position: Vector) {
        const distance = DistanceHelper.getMagnitude(
            Vector.parse({
                x: position.x - (this.position.x + this.width / 2),
                y: position.y - (this.position.y + this.height / 2),
            }),
        );

        return distance < this.interactionDistance;
    }

    activate(player: Player) {
        player.healing = 6;
        player.healthPack += 1;
        player.healthPack = Math.min(player.healthPack, 3);

        AudioManager.playAudio('player_medkit_use_audio').then();
        this.interactableEventEmitter.notify('medkit:collected', this);
    }
}
