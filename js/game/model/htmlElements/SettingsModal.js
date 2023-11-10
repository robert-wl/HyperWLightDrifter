import Modal from './Modal.js';
import AudioManager from '../utility/manager/AudioManager.js';
export default class SettingsModal extends Modal {
    constructor(eventEmitter) {
        super($('#settings-modal'), eventEmitter);
        this.eventFunction = ({ event }) => {
            if (event === 'settingsModal:open') {
                this.open();
                return;
            }
        };
        this.volumeLowerButton = $('#volume-down');
        this.volumeHigherButton = $('#volume-up');
        this.volumeMeter = $('.volume-meter');
        this.fpsCounterText = $('#fps-counter-text');
        this.fpsCounterLeftButton = $('#fps-counter-toggle-left');
        this.fpsCounterRightButton = $('#fps-counter-toggle-right');
        this.exitButton = $('#exit-button-settings');
        this.showFPS = false;
        this.handleInteraction();
        this.handleEvent();
    }
    handleEvent() {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }
    handleVolumeInteraction(type) {
        if (type === 'lower') {
            AudioManager.decreaseVolume();
        }
        if (type === 'higher') {
            AudioManager.increaseVolume();
        }
        for (let i = 0; i < 10; i++) {
            if (i + 1 <= Math.round(AudioManager.volume * 10)) {
                this.volumeMeter.eq(i).removeClass('off');
                this.volumeMeter.eq(i).addClass('on');
            }
            else {
                this.volumeMeter.eq(i).addClass('off');
                this.volumeMeter.eq(i).removeClass('on');
            }
        }
    }
    handleFPSCounterInteraction() {
        if (this.showFPS) {
            this.showFPS = false;
            this.fpsCounterText.text('Off');
            this.eventEmitter.notify('toggleFPS', false);
            return;
        }
        this.showFPS = true;
        this.fpsCounterText.text('On');
        this.eventEmitter.notify('toggleFPS', true);
    }
    handleInteraction() {
        this.volumeLowerButton.off();
        this.volumeLowerButton.on('mousedown', () => {
            this.handleVolumeInteraction('lower');
        });
        this.volumeHigherButton.off();
        this.volumeHigherButton.on('mousedown', () => {
            this.handleVolumeInteraction('higher');
        });
        this.fpsCounterLeftButton.off();
        this.fpsCounterLeftButton.on('mousedown', () => {
            this.handleFPSCounterInteraction();
        });
        this.fpsCounterRightButton.off();
        this.fpsCounterRightButton.on('mousedown', () => {
            this.handleFPSCounterInteraction();
        });
        this.exitButton.off();
        this.exitButton.on('mousedown', () => {
            this.eventEmitter.notify('menuModal:open');
            this.close();
        });
    }
}
