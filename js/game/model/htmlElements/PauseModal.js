import Game from '../Game/Game.js';
import Modal from './Modal.js';

export default class PauseModal extends Modal {
    static modal = $('#pause-modal');
    static continueButton = $('#continue-button');
    static settingsButton = $('#settings-button');
    static exitButton = $('#exit-button');

    static handleInteraction() {
        this.continueButton.mousedown(() => {
            Game.getInstance().unpauseGame();
        });

        this.settingsButton.mousedown(() => {
            this.close();
        });

        this.exitButton.mousedown(() => {
            this.close();
        });
    }
}
