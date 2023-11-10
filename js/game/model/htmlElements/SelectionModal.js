import Modal from './Modal.js';
import GameSettings from '../../constants.js';
export default class SelectionModal extends Modal {
    constructor(eventEmitter) {
        super($('#selection-modal'), eventEmitter);
        this.selectedImage = 0;
        this.eventFunction = ({ event }) => {
            if (event === 'selectionModal:open') {
                this.open();
            }
        };
        this.imageList = GameSettings.GAME.MAIN_MENU.SELECTION.IMAGE_OUTFIT_REF;
        this.outfit = GameSettings.GAME.MAIN_MENU.SELECTION.OUTFIT;
        this.playButton = $('#play-button');
        this.cancelButton = $('#cancel-button');
        this.arrowLeft = $('#image-arrow-left');
        this.arrowRight = $('#image-arrow-right');
        this.imagePreview = $('#player-preview');
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }
    handleInteraction() {
        this.cancelButton.off();
        this.cancelButton.on('mousedown', () => {
            this.eventEmitter.notify('menuModal:open');
            this.close();
        });
        this.playButton.off();
        this.playButton.on('mousedown', () => {
            this.eventEmitter.notify('playGame');
            this.close();
        });
        this.arrowLeft.off();
        this.arrowLeft.on('mousedown', () => {
            this.selectedImage -= 1;
            if (this.selectedImage === -1) {
                this.selectedImage = 2;
            }
            this.imagePreview.attr('src', this.imageList[this.selectedImage]);
            this.eventEmitter.notify('changeOutfit', this.outfit[this.selectedImage]);
        });
        this.arrowRight.off();
        this.arrowRight.on('mousedown', () => {
            this.selectedImage += 1;
            if (this.selectedImage === 3) {
                this.selectedImage = 0;
            }
            this.imagePreview.attr('src', this.imageList[this.selectedImage]);
            this.eventEmitter.notify('changeOutfit', this.outfit[this.selectedImage]);
        });
    }
}
