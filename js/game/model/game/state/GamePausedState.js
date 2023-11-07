import GameBaseState from './GameBaseState.js';
import Game from '../Game.js';

export default class GamePausedState extends GameBaseState {
    enterState(game) {
        game.htmlHandlers.notify('pauseModal:open');

        const { keys } = Game.getInstance();

        keys.splice(keys.indexOf('p'), 1);
    }

    updateState(game) {
        const { keys } = Game.getInstance();

        if (keys.includes('p')) {
            keys.splice(keys.indexOf('p'), 1);
            game.unpauseGame();
        }
    }

    exitState(game) {
        game.htmlHandlers.notify('pauseModal:close');
    }
}
