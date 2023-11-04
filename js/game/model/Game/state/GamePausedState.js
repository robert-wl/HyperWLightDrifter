import GameBaseState from './GameBaseState.js';
import PauseModal from '../../htmlElements/PauseModal.js';
import Game from '../Game.js';

export default class GamePausedState extends GameBaseState {
    enterState(_game) {
        PauseModal.open();

        const { keys } = Game.getInstance();

        keys.splice(keys.indexOf('escape'), 1);
    }

    updateState(game) {
        const { keys } = Game.getInstance();

        if (keys.includes('escape')) {
            keys.splice(keys.indexOf('escape'), 1);
            game.unpauseGame();
        }
    }

    exitState(_game) {
        PauseModal.close();
    }
}
