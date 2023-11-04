export default class LoadingModal {
    static modal = $('#loading-modal');
    static loadingAsset = $('#loading-asset');
    static loadingNumber = $('#loading-number');

    static open() {
        this.modal.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
        this.loadingAsset.text('');
        this.loadingNumber.text('');
    }

    static close() {
        this.modal.css('display', 'none');
    }

    static editText(text) {
        this.loadingAsset.text(text);
    }

    static editCounter(text) {
        this.loadingNumber.text(text);
    }
}
