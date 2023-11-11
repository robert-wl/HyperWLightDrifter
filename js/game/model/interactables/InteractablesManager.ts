import Observable from '../utility/Observable.js';
import InteractablesFactory from './InteractablesFactory.js';
import { Interactables } from '../utility/interfaces/Interactables.js';
import Game from '../game/Game.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Coin from './Coin.js';

export default class InteractablesManager {
    private game: Game;
    private readonly eventEmitter: Observable;
    private _interactablesList: Interactables[];
    private coinList: Coin[];
    private readonly _interactablesFactory: InteractablesFactory;

    public constructor(game: Game) {
        this.game = game;
        this.eventEmitter = new Observable();
        this._interactablesList = [];
        this.coinList = [];
        this._interactablesFactory = new InteractablesFactory(this.eventEmitter);

        this.eventHandler();
    }

    set interactablesList(value: Interactables[]) {
        this._interactablesList = value;
    }

    get interactablesFactory(): InteractablesFactory {
        return this._interactablesFactory;
    }

    public updateCoins() {
        this.coinList.forEach((coin) => {
            coin.update();
        });
    }

    public detectInteractable(playerPosition: Vector) {
        const validCoins = this.coinList.filter((key) => {
            return key.detectInteraction(playerPosition);
        });

        const validInteractable = this._interactablesList.filter((interactable) => {
            return interactable.detectInteraction(playerPosition);
        });

        const resultList = [...validCoins, ...validInteractable];
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
            if (event === 'addInteractable:coin') {
                this.coinList.push(data);
                return;
            }
            if (event === 'coin:collected') {
                Game.getInstance().coinCount += 1;
                this.coinList.splice(this.coinList.indexOf(data), 1);
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
