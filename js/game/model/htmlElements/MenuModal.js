import Modal from './Modal.js';
export default class MenuModal extends Modal {
    constructor(eventEmitter) {
        super($('#menu-modal'), eventEmitter);
        this.newGameButton = $('.new-game');
        this.settingsButton = $('.settings');
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.subscribe(({ event }) => {
            if (event === 'menuModal:open') {
                this.open();
                return;
            }
            if (event === 'menuModal:toggle') {
                this.toggle();
            }
        });
    }
    handleInteraction() {
        this.newGameButton.on('mousedown', () => {
            this.eventEmitter.notify('selectionModal:open');
            this.close();
        });
        this.settingsButton.on('mousedown', () => {
            this.eventEmitter.notify('settingsModal:open');
            this.close();
        });
    }
}
