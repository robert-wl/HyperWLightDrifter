import MenuModal from './MenuModal.js';
import Modal from './Modal.js';
import Game from '../Game/Game.js';

export default class SelectionModal extends Modal {
    static imageList = ['../assets/ui/player_select/player-red.png', '../assets/ui/player_select/player-dark.png', '../assets/ui/player_select/player-yellow.png'];
    static outfit = ['default', 'dark', 'yellow'];
    static selectedImage = 0;
    static modal = $('#selection-modal');
    static playButton = $('#play-button');
    static cancelButton = $('#cancel-button');
    static arrowLeft = $('#image-arrow-left');
    static arrowRight = $('#image-arrow-right');
    static imagePreview = $('#player-preview');

    static handleInteraction() {
        this.cancelButton.mousedown(() => {
            this.close();
            MenuModal.open();
        });

        this.playButton.mousedown(() => {
            MenuModal.removeInteraction();
            this.close();
        });

        this.arrowLeft.mousedown(() => {
            this.selectedImage -= 1;

            if (this.selectedImage === -1) {
                this.selectedImage = 2;
            }

            this.imagePreview.attr('src', this.imageList[this.selectedImage]);

            Game.getInstance().player.outfit = this.outfit[this.selectedImage];
        });

        this.arrowRight.mousedown(() => {
            this.selectedImage += 1;

            if (this.selectedImage === 3) {
                this.selectedImage = 0;
            }

            this.imagePreview.attr('src', this.imageList[this.selectedImage]);

            Game.getInstance().player.outfit = this.outfit[this.selectedImage];
        });
    }
}
