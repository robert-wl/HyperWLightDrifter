import Modal from './Modal.js';
import Observable from '../utility/Observable';

export default class LoadingModal extends Modal {
    protected loadingAsset: JQuery;
    protected loadingNumber: JQuery;

    public constructor(eventEmitter: Observable) {
        super($('#loading-modal'), eventEmitter);
        this.loadingAsset = $('#loading-asset');
        this.loadingNumber = $('#loading-number');
    }

    public editText(text: string) {
        this.loadingAsset.text(text);
    }

    public editCounter(text: string) {
        this.loadingNumber.text(text);
    }

    public open() {
        super.open();
    }

    protected handleEvent(): void {}
}
