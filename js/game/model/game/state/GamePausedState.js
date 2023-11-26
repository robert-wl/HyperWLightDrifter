var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import GameBaseState from './GameBaseState.js';
export default class GamePausedState extends GameBaseState {
    constructor() {
        super(...arguments);
        this.eventHandler = (game) => game.inputManager.inputObservable.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                if (data === 'p') {
                    game.unpauseGame();
                }
            }
        });
        this.eventRemover = (game) => game.inputManager.inputObservable.unsubscribe(this.eventHandler);
    }
    enterState(game) {
        return __awaiter(this, void 0, void 0, function* () {
            game.htmlHandlers.notify('pauseModal:open');
            this.eventHandler(game);
        });
    }
    exitState(game) {
        return __awaiter(this, void 0, void 0, function* () {
            game.htmlHandlers.notify('pauseModal:close');
            this.eventRemover(game);
        });
    }
}
