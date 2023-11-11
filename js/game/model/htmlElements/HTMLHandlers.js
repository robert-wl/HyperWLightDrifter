var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import MenuModal from './MenuModal.js';
import Observable from '../utility/Observable.js';
import SelectionModal from './SelectionModal.js';
import SettingsModal from './SettingsModal.js';
import LoadingModal from './LoadingModal.js';
import PauseModal from './PauseModal.js';
import AudioManager from '../utility/manager/AudioManager.js';
import EndingVideo from './EndingVideo.js';
export default class HTMLHandlers {
    constructor(game) {
        this.eventRemover = () => this.HUD.off();
        this.HUDHandler = () => this.HUD.off().on('mousedown', () => {
            if (this.selectionModal.isOpen()) {
                return;
            }
            if (this.game.currState !== this.game.startState) {
                return;
            }
            if (!this.isInMenu) {
                return;
            }
            this.modalObservable.notify('menuModal:toggle');
        });
        this.modalObservable = new Observable();
        this.isInMenu = true;
        this.game = game;
        this.HUD = $('#HUD');
        this.hoverable = $('.hoverable');
        this.openingScreen = $('#opening-screen');
        this.menuModal = new MenuModal(this.modalObservable);
        this.selectionModal = new SelectionModal(this.modalObservable);
        this.settingsModal = new SettingsModal(this.modalObservable);
        this._loadingModal = new LoadingModal(this.modalObservable);
        this.pauseModal = new PauseModal(this.modalObservable);
        this.endingVideo = new EndingVideo(this.modalObservable);
        this.HUDHandler();
        this.eventHandler();
    }
    notify(event, data) {
        this.modalObservable.notify(event, data);
    }
    eventHandler() {
        this.modalObservable.subscribe(({ event, data }) => __awaiter(this, void 0, void 0, function* () {
            if (event === 'playGame') {
                this.isInMenu = false;
                this.openingScreen.css('opacity', '0').css('animation', 'fadeOut 2s ease-in-out');
                yield this.game.playGame();
                this.openingScreen.css('display', 'none');
            }
            if (event === 'continueGame') {
                this.game.unpauseGame();
                return;
            }
            if (event === 'backToStartScreen') {
                this.game.switchState(this.game.startState).then();
                this.openingScreen.css('animation', 'fadeIn 0.5s ease-in-out');
                this.isInMenu = true;
                return;
            }
            if (event === 'loseGameFinished') {
                this.openingScreen.css('animation', 'fadeIn 0.5s ease-in-out');
                this.isInMenu = true;
                return;
            }
            if (event === 'endGame') {
                this.endingVideo.open();
                return;
            }
            if (event === 'startScreen') {
                this.openingScreen.css('opacity', '100%').css('display', 'block');
                return;
            }
            if (event === 'changeOutfit') {
                this.game.player.outfit = data;
                return;
            }
            if (event === 'toggleFPS') {
                this.game.showFPS = data;
                return;
            }
            if (event === 'finishGame') {
                this.game.switchState(this.game.startState).then();
                this.isInMenu = true;
                $('#opening-screen').attr('src', '../assets/ui/start_end.png').css('animation', 'fadeIn 0.5s ease-in-out');
            }
        }));
        this.hoverable.on('mouseenter', () => {
            AudioManager.playAudio('menu_move_audio').then();
        });
    }
}
