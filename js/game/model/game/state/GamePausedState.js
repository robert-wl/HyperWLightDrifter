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
        game.htmlHandlers.notify('pauseModal:open');
        this.eventHandler(game);
    }
    exitState(game) {
        game.htmlHandlers.notify('pauseModal:close');
        this.eventRemover(game);
    }
}
