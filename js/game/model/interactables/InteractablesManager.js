import Observable from '../utility/Observable.js';
import InteractablesFactory from './InteractablesFactory.js';
import Game from '../game/Game.js';
export default class InteractablesManager {
    constructor(game) {
        this.eventHandler = () => this.eventEmitter.subscribe(({ event, data }) => {
            var _a;
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
                const pieces = (_a = this.game.objects.get(data.key)) === null || _a === void 0 ? void 0 : _a.pieces;
                pieces && pieces.splice(pieces.indexOf(data), 1);
                return;
            }
            if (event === 'elevator:move') {
                this._interactablesList.splice(this._interactablesList.indexOf(data), 1);
                return;
            }
        });
        this.game = game;
        this.eventEmitter = new Observable();
        this._interactablesList = [];
        this.coinList = [];
        this._interactablesFactory = new InteractablesFactory(this.eventEmitter);
        this.eventHandler();
    }
    set interactablesList(value) {
        this._interactablesList = value;
    }
    get interactablesFactory() {
        return this._interactablesFactory;
    }
    updateCoins() {
        this.coinList.forEach((coin) => {
            coin.update();
        });
    }
    detectInteractable(playerPosition) {
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
}
