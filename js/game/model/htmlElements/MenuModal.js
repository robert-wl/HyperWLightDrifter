import SelectionModal from './SelectionModal.js';
import Modal from './Modal.js';

export default class MenuModal extends Modal {
    static modal = $('#menu-modal');
    static newGameButton = $('.new-game');
    static settingsButton = $('.settings');
    static exitButton = $('.exit');

    static handleInteraction() {
        $('#HUD').mousedown(() => {
            console.log('hai');
            if (SelectionModal.modal.css('display') === 'flex') {
                return;
            }

            if (this.modal.css('display') === 'none') {
                this.open();
                return;
            }
            this.close();
        });

        this.newGameButton.mousedown(() => {
            this.close();
            SelectionModal.open();
        });

        this.settingsButton.mousedown(() => {
            this.close();
        });
    }

    static removeInteraction() {
        $('#HUD').off('mousedown');
        this.newGameButton.off('mousedown');
        this.settingsButton.off('mousedown');
    }
}
