import Modal from './Modal.js';
import Observable from '../utility/Observable.js';

export default class PauseModal extends Modal {
    protected continueButton: JQuery;
    protected exitButton: JQuery;

    constructor(eventEmitter: Observable) {
        super($('#pause-modal'), eventEmitter);
        this.continueButton = $('#continue-button');
        this.exitButton = $('#exit-button');

        this.handleInteraction();
    }

    protected handleEvent(): void {}

    private handleInteraction() {
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
