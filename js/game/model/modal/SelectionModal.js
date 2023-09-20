import MenuModal from "./MenuModal.js";
import Modal from "./Modal.js";


export default class SelectionModal extends Modal {
    static modal = $('#selection-modal');
    static playButton = $('#play-button');
    static cancelButton = $('#cancel-button');

    static handleInteraction() {

        this.cancelButton.mousedown(() => {
            this.close();
            MenuModal.open();
        });

        this.playButton.mousedown(() => {
            MenuModal.removeInteraction();
            this.close();
        });
    }
}
