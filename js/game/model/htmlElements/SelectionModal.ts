import Modal from './Modal.js';
import Observable from '../utility/Observable.js';
import GameSettings from '../../constants.js';

export default class SelectionModal extends Modal {
    protected imageList: string[];
    protected outfit: string[];
    protected selectedImage = 0;
    protected playButton: JQuery;
    protected cancelButton: JQuery;
    protected arrowLeft: JQuery;
    protected arrowRight: JQuery;
    protected imagePreview: JQuery;

    public constructor(eventEmitter: Observable) {
        super($('#selection-modal'), eventEmitter);
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

    protected handleEvent(): void {
        this.eventEmitter.subscribe(({ event }) => {
            console.log(event);
            if (event === 'selectionModal:open') {
                this.open();
            }
        });
    }

    private handleInteraction() {
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
