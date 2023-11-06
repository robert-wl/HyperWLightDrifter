import Modal from './Modal.js';
export default class LoadingModal extends Modal {
    constructor(eventEmitter) {
        super($('#loading-modal'), eventEmitter);
        this.loadingAsset = $('#loading-asset');
        this.loadingNumber = $('#loading-number');
    }
    editText(text) {
        this.loadingAsset.text(text);
    }
    editCounter(text) {
        this.loadingNumber.text(text);
    }
    open() {
        super.open();
    }
    handleEvent() { }
}
