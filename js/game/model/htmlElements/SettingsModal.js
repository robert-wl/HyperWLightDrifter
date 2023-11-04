import Modal from './Modal.js';
import AudioPlayer from '../../../audio/AudioPlayer.js';
import Game from '../Game/Game.js';
import MenuModal from './MenuModal.js';

export default class SettingsModal extends Modal {
    static modal = $('#settings-modal');
    static volumeLowerButton = $('#volume-down');
    static volumeHigherButton = $('#volume-up');
    static volumeMeter = $('.volume-meter');
    static fullscreenText = $('#fullscreen-text');
    static fullscreenLeftButton = $('#fullscreen-toggle-left');
    static fullscreenRightButton = $('#fullscreen-toggle-right');
    static fpsCounterText = $('#fps-counter-text');
    static fpsCounterLeftButton = $('#fps-counter-toggle-left');
    static fpsCounterRightButton = $('#fps-counter-toggle-right');
    static exitButton = $('#exit-button-settings');

    static handleVolumeInteraction(type) {
        if (type === 'lower') {
            AudioPlayer.getInstance().decreaseVolume();
        }
        if (type === 'higher') {
            AudioPlayer.getInstance().increaseVolume();
        }

        const { volume } = AudioPlayer.getInstance();
        for (let i = 0; i < 10; i++) {
            if (i + 1 <= Math.round(volume * 10)) {
                this.volumeMeter.eq(i).removeClass('off');
                this.volumeMeter.eq(i).addClass('on');
            } else {
                this.volumeMeter.eq(i).addClass('off');
                this.volumeMeter.eq(i).removeClass('on');
            }
        }
    }

    static handleFullscreenInteraction() {
        const { fullscreen } = Game.getInstance();
        console.log(fullscreen);
        if (fullscreen) {
            this.fullscreenText.text('Off');
            Game.getInstance().fullscreen = false;
        }
        if (!fullscreen) {
            this.fullscreenText.text('On');
            Game.getInstance().fullscreen = true;
        }
        Game.getInstance().toggleFullscreen();
    }

    static handleFPSCounterInteraction() {
        const { showFPS } = Game.getInstance();
        if (showFPS) {
            this.fpsCounterText.text('Off');
            Game.getInstance().showFPS = false;
        }
        if (!showFPS) {
            this.fpsCounterText.text('On');
            Game.getInstance().showFPS = true;
        }
    }

    static handleInteraction() {
        this.volumeLowerButton.on('mousedown', () => {
            this.handleVolumeInteraction('lower');
        });

        this.volumeHigherButton.on('mousedown', () => {
            this.handleVolumeInteraction('higher');
        });
        this.fullscreenLeftButton.on('mousedown', () => {
            this.handleFullscreenInteraction();
        });
        this.fullscreenRightButton.on('mousedown', () => {
            this.handleFullscreenInteraction();
        });
        this.fpsCounterLeftButton.on('mousedown', () => {
            this.handleFPSCounterInteraction();
        });
        this.fpsCounterRightButton.on('mousedown', () => {
            this.handleFPSCounterInteraction();
        });
        this.exitButton.on('mousedown', () => {
            this.close();
            MenuModal.open();
        });
    }
}
