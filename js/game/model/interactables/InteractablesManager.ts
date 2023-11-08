import Observable from '../utility/Observable.js';
import InteractablesFactory from './InteractablesFactory.js';
import { Interactables } from '../utility/enums/Interactables.js';
import Game from '../game/Game.js';
import { Vector } from '../utility/enums/Vector';

export default class InteractablesManager {
    private game: Game;
    private eventEmitter: Observable;
    private _interactablesList: Interactables[];
    private _interactablesFactory: InteractablesFactory;

    public constructor(game: Game) {
        this.game = game;
        this.eventEmitter = new Observable();
        this._interactablesList = [];
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

    public detectInteractable(playerPosition: Vector) {
        const validInteractable = this._interactablesList.filter((interactable) => {
            return interactable.detectInteraction(playerPosition);
        });

        if (validInteractable.length > 0) {
            return validInteractable[0];
        }
        return null;
    }

    private eventHandler = () =>
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'addInteractable') {
                this._interactablesList.push(data);
                return;
            }
            if (event === 'key:collected') {
                Game.getInstance().keyCount += 1;
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
