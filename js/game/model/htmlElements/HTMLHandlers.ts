import MenuModal from './MenuModal.js';
import Observable from '../utility/Observable.js';
import SelectionModal from './SelectionModal.js';
import SettingsModal from './SettingsModal.js';
import Game from '../game/Game.js';
import LoadingModal from './LoadingModal.js';

export default class HTMLHandlers {
    private readonly eventEmitter: Observable;
    private game: Game;
    private HUD: JQuery;
    private openingScreen: JQuery;
    private menuModal: MenuModal;
    private selectionModal: SelectionModal;
    private settingsModal: SettingsModal;
    private _loadingModal: LoadingModal;

    public constructor(game: Game) {
        this.eventEmitter = new Observable();
        this.game = game;
        this.HUD = $('#HUD');
        this.openingScreen = $('#opening-screen');
        this.menuModal = new MenuModal(this.eventEmitter);
        this.selectionModal = new SelectionModal(this.eventEmitter);
        this.settingsModal = new SettingsModal(this.eventEmitter);
        this._loadingModal = new LoadingModal(this.eventEmitter);

        this.HUDHandler();
        this.eventHandler();
    }

    get loadingModal(): LoadingModal {
        return this._loadingModal;
    }

    private HUDHandler() {
        this.HUD.on('mousedown', () => {
            if (this.selectionModal.isOpen()) {
                return;
            }
            this.eventEmitter.notify('menuModal:toggle');
        });
    }

    private eventHandler() {
        this.eventEmitter.subscribe(({ event, data }) => {
            if (event === 'playGame') {
                this.menuModal.removeInteraction();
                return;
            }
            if (event === 'continueGame') {
                this.game.unpauseGame();
                return;
            }
            if (event === 'backToStartScreen') {
                this.game.switchState(this.game.startState).then();

                this.openingScreen.css('animation', 'fadeIn 0.5s ease-in-out');
                return;
            }
            if (event === 'changeOutfit') {
                this.game.player.outfit = data;
            }
            if (event === 'toggleFPS') {
                this.game.showFPS = data;
            }
        });
    }
}
