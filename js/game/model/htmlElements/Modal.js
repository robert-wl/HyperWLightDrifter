import AudioManager from '../utility/manager/AudioManager.js';
export default class Modal {
    constructor(modal, eventEmitter) {
        this._modal = modal;
        this.eventEmitter = eventEmitter;
    }
    get modal() {
        return this._modal;
    }
    isOpen() {
        return this._modal.css('display') === 'flex';
    }
    open() {
        var _a;
        (_a = this._modal) === null || _a === void 0 ? void 0 : _a.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
        AudioManager.playAudio('menu_action_audio').then();
    }
    toggle() {
        if (this._modal.css('display') === 'none') {
            this.open();
        }
        else {
            this.close();
        }
    }
    close() {
        var _a;
        (_a = this._modal) === null || _a === void 0 ? void 0 : _a.css('display', 'none');
    }
}
