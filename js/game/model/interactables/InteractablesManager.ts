import Observable from '../utility/Observable.js';
import InteractablesFactory from './InteractablesFactory.js';
import { Interactables } from '../utility/interfaces/Interactables.js';
import Game from '../game/Game.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Key from './Key.js';

export default class InteractablesManager {
    private game: Game;
    private eventEmitter: Observable;
    private _interactablesList: Interactables[];
    private keyList: Key[];
    private _interactablesFactory: InteractablesFactory;

    public constructor(game: Game) {
        this.game = game;
        this.eventEmitter = new Observable();
        this._interactablesList = [];
        this.keyList = [];
        this._interactablesFactory = new InteractablesFactory(this.eventEmitter);

        this.eventHandler();
    }

    get interactablesList(): Interactables[] {
        return this._interactablesList;
    }

    set interactablesList(value: Interactables[]) {
        this._interactablesList = value;
    }

    get interactablesFactory(): InteractablesFactory {
        return this._interactablesFactory;
    }

    set interactablesFactory(value: InteractablesFactory) {
        this._interactablesFactory = value;
    }

    public updateKeys() {
        this.keyList.forEach((key) => {
            key.update();
        });
    }

    public detectInteractable(playerPosition: Vector) {
        const validKey = this.keyList.filter((key) => {
            return key.detectInteraction(playerPosition);
        });

        const validInteractable = this._interactablesList.filter((interactable) => {
            return interactable.detectInteraction(playerPosition);
        });

        const resultList = [...validKey, ...validInteractable];
        if (resultList.length > 0) {
            return resultList[0];
        }
        return null;
    }

    private eventHandler = () =>
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'addInteractable') {
                this._interactablesList.push(data);
                return;
            }
            if (event === 'addInteractable:key') {
                this.keyList.push(data);
                return;
            }
            if (event === 'key:collected') {
                Game.getInstance().keyCount += 1;
                this.keyList.splice(this.keyList.indexOf(data), 1);
                return;
            }
            if (event === 'medkit:collected') {
                this._interactablesList.splice(this._interactablesList.indexOf(data), 1);
                const pieces = this.game.objects.get(data.key)?.pieces;
                pieces && pieces.splice(pieces.indexOf(data), 1);
                return;
            }
            if (event === 'elevator:move') {
                this._interactablesList.splice(this._interactablesList.indexOf(data), 1);
                return;
            }
        });
}
