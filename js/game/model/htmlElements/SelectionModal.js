import Modal from './Modal.js';
import GameSettings from '../../constants.js';
export default class SelectionModal extends Modal {
    constructor(eventEmitter) {
        super($('#selection-modal'), eventEmitter);
        this.selectedImage = 0;
        this.imageList = GameSettings.GAME.MAIN_MENU.SELECTION.IMAGE_OUTFIT_REF;
        this.outfit = GameSettings.GAME.MAIN_MENU.SELECTION.OUTFIT;
        this.playButton = $('#play-button');
        this.cancelButton = $('#cancel-button');
        this.arrowLeft = $('#arrow-left');
        this.arrowRight = $('#arrow-right');
        this.imagePreview = $('#image-preview');
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.subscribe(({ event }) => {
            if (event === 'selectionModal:open') {
                this.open();
            }
        });
    }
    handleInteraction() {
        this.cancelButton.on('mousedown', () => {
            this.eventEmitter.notify('menuModal:open');
            this.close();
        });
        this.playButton.on('mousedown', () => {
            this.eventEmitter.notify('playGame');
            this.close();
        });
        this.arrowLeft.on('mousedown', () => {
            this.selectedImage -= 1;
            if (this.selectedImage === -1) {
                this.selectedImage = 2;
            }
            this.imagePreview.attr('src', this.imageList[this.selectedImage]);
            this.eventEmitter.notify('changeOutfit', this.outfit[this.selectedImage]);
        });
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
