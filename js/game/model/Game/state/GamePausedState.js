import GameBaseState from './GameBaseState.js';
import PauseModal from '../../htmlElements/PauseModal.js';
import Game from '../Game.js';

export default class GamePausedState extends GameBaseState {
    enterState(game) {
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

    exitState(game) {
        PauseModal.close();
    }
}
