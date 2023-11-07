import Modal from './Modal.js';
export default class PauseModal extends Modal {
    constructor(eventEmitter) {
        super($('#pause-modal'), eventEmitter);
        this.continueButton = $('#continue-button');
        this.exitButton = $('#exit-button');
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.subscribe(({ event }) => {
            if (event === 'pauseModal:open') {
                this.open();
                return;
            }
            if (event === 'menuModal:close') {
                this.close();
                return;
            }
        });
    }
    handleInteraction() {
        this.continueButton.on('mousedown', () => {
            this.eventEmitter.notify('continueGame');
            this.close();
        });
        this.exitButton.on('mousedown', () => {
            this.eventEmitter.notify('backToStartScreen');
            this.close();
        });
    }
}
