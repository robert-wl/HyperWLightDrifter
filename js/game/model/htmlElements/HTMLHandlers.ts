import MenuModal from './MenuModal.js';
import Observable from '../utility/Observable.js';
import SelectionModal from './SelectionModal.js';
import SettingsModal from './SettingsModal.js';
import Game from '../game/Game.js';
import LoadingModal from './LoadingModal.js';
import PauseModal from './PauseModal.js';

export default class HTMLHandlers {
    private readonly modalObservable: Observable;
    private isInMenu: boolean;
    private game: Game;
    private HUD: JQuery;
    private openingScreen: JQuery;
    private menuModal: MenuModal;
    private selectionModal: SelectionModal;
    private settingsModal: SettingsModal;
    private _loadingModal: LoadingModal;
    private pauseModal: PauseModal;

    public constructor(game: Game) {
        this.modalObservable = new Observable();
        this.isInMenu = true;
        this.game = game;
        this.HUD = $('#HUD');
        this.openingScreen = $('#opening-screen');
        this.menuModal = new MenuModal(this.modalObservable);
        this.selectionModal = new SelectionModal(this.modalObservable);
        this.settingsModal = new SettingsModal(this.modalObservable);
        this._loadingModal = new LoadingModal(this.modalObservable);
        this.pauseModal = new PauseModal(this.modalObservable);

        this.HUDHandler();
        this.eventHandler();
    }

    public eventRemover() {
        this.HUD.off();
    }

    public notify(event: any, data?: any) {
        this.modalObservable.notify(event, data);
    }

    private HUDHandler = () =>
        this.HUD.on('mousedown', () => {
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

    private eventHandler() {
        this.modalObservable.subscribe(async ({ event, data }) => {
            if (event === 'playGame') {
                this.isInMenu = false;
                this.openingScreen.css('opacity', '0').css('animation', 'fadeOut 2s ease-in-out');
                await this.game.playGame();
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
            }
        });
    }
}
