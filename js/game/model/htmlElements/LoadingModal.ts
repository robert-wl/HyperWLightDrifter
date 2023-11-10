import Modal from './Modal.js';
import Observable from '../utility/Observable';

export default class LoadingModal extends Modal {
    protected loadingAsset: JQuery;
    protected loadingNumber: JQuery;

    public constructor(eventEmitter: Observable) {
        super($('#loading-modal'), eventEmitter);
        this.loadingAsset = $('#loading-asset');
        this.loadingNumber = $('#loading-number');

        this.close();
        this.handleEvent();
    }

    public editText(text: string) {
        this.loadingAsset.text(text);
    }

    public editCounter(text: string) {
        this.loadingNumber.text(text);
    }

    protected handleEvent(): void {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }

    private eventFunction = ({ event, data }) => {
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
    };
}
