import Modal from './Modal.js';
export default class LoadingModal extends Modal {
    constructor(eventEmitter) {
        super($('#loading-modal'), eventEmitter);
        this.loadingAsset = $('#loading-asset');
        this.loadingNumber = $('#loading-number');
        this.close();
        this.handleEvent();
    }
    editText(text) {
        this.loadingAsset.text(text);
    }
    editCounter(text) {
        this.loadingNumber.text(text);
    }
    handleEvent() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'loadingModal:open') {
                this.open();
                return;
            }
            if (event === 'loadingModal:close') {
                this.close();
                return;
            }
            if (event === 'loadingModal:editText') {
                this.editText(data);
                return;
            }
            if (event === 'loadingModal:editCounter') {
                this.editCounter(data);
                return;
            }
        });
    }
}
