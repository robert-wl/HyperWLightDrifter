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
        this.keyList = [];
        this._interactablesFactory = new InteractablesFactory(this.eventEmitter);
        this.eventHandler();
    }
    get interactablesList() {
        return this._interactablesList;
    }
    set interactablesList(value) {
        this._interactablesList = value;
    }
    get interactablesFactory() {
        return this._interactablesFactory;
    }
    set interactablesFactory(value) {
        this._interactablesFactory = value;
    }
    updateKeys() {
        this.keyList.forEach((key) => {
            key.update();
        });
    }
    detectInteractable(playerPosition) {
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
}
