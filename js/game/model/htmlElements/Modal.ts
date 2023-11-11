import Observable from '../utility/Observable.js';
import AudioManager from '../utility/manager/AudioManager.js';

export default abstract class Modal {
    protected eventEmitter: Observable;
    private readonly _modal: JQuery;

    protected constructor(modal: JQuery, eventEmitter: Observable) {
        this._modal = modal;
        this.eventEmitter = eventEmitter;
    }

    get modal(): JQuery {
        return this._modal;
    }

    public isOpen() {
        return this._modal.css('display') === 'flex';
    }

    protected open() {
        this._modal?.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');

        AudioManager.playAudio('menu_action_audio').then();
    }

    protected toggle() {
        if (this._modal.css('display') === 'none') {
            this.open();
        } else {
            this.close();
        }
    }

    protected close() {
        this._modal?.css('display', 'none');
    }

    protected abstract handleEvent(): void;
}
