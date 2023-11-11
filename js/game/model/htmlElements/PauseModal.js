import Modal from './Modal.js';
export default class PauseModal extends Modal {
    constructor(eventEmitter) {
        super($('#pause-modal'), eventEmitter);
        this.eventFunction = ({ event }) => {
            if (event === 'pauseModal:open') {
                this.open();
                return;
            }
            if (event === 'menuModal:close') {
                this.close();
                return;
            }
        };
        this.continueButton = $('#continue-button');
        this.exitButton = $('#exit-button');
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }
    handleInteraction() {
        this.continueButton.off('mousedown.pauseModal').on('mousedown.pauseModal', () => {
            this.eventEmitter.notify('continueGame');
            this.close();
        });
        this.exitButton.off('mousedown.pauseModal').on('mousedown.pauseModal', () => {
            this.eventEmitter.notify('backToStartScreen');
            this.close();
        });
    }
}
