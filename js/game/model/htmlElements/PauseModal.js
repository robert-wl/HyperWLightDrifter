import Game from '../Game/Game.js';
import Modal from './Modal.js';

export default class PauseModal extends Modal {
    static modal = $('#pause-modal');
    static continueButton = $('#continue-button');
    static exitButton = $('#exit-button');

    static handleInteraction() {
        this.continueButton.on('mousedown', () => {
            Game.getInstance().unpauseGame();
        });

        this.exitButton.on('mousedown', () => {
            Game.getInstance().switchState(Game.getInstance().startState).then();
            $('#opening-screen').css('animation', 'fadeIn 0.5s ease-in-out');
            this.close();
        });
    }
}
