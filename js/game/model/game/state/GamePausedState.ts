import GameBaseState from './GameBaseState.js';
import Game from '../Game.js';

export default class GamePausedState extends GameBaseState {
    public async enterState(game: Game) {
        game.htmlHandlers.notify('pauseModal:open');

        this.eventHandler(game);
    }

    public async exitState(game: Game) {
        game.htmlHandlers.notify('pauseModal:close');
        this.eventRemover(game);
    }

    private eventHandler = (game: Game) =>
        game.inputManager.inputObservable.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                if (data === 'p') {
                    game.unpauseGame();
                }
            }
        });

    private eventRemover = (game: Game) => game.inputManager.inputObservable.unsubscribe(this.eventHandler);
}
