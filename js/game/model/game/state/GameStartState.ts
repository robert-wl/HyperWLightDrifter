import GameBaseState from './GameBaseState.js';
import Game from '../Game.js';
import GameSettings from '../../../constants.js';
import { assetLoader } from '../../../helper/assets/assetLoader.js';
import Navbar from '../../htmlElements/Navbar.js';
import AssetManager from '../../utility/AssetManager.js';
import { Vector } from '../../utility/enums/Vector.js';

export default class GameStartState extends GameBaseState {
    private spawnParticles: boolean;

    constructor() {
        super();
        this.spawnParticles = false;
    }

    async enterState(game: Game) {
        super.enterState(game);
        Navbar.open();
        game.toggleFullscreen(false);
        this.spawnParticles = true;

        // game.instance = null;

        Game.getInstance();

        await game.init();

        game.htmlHandlers.notify('startScreen');

        game.prepareCanvas();
        game.changeState();
        await AssetManager.assetLoader([GameSettings.ASSETS.SPAWN]);
        await assetLoader([GameSettings.ASSETS.SPAWN], game.htmlHandlers);

        // menuHandler();

        const { audio } = game;

        audio.allowSound = true;
        audio.playAudio('menu/background.ogg', null, true);
    }

    updateState(game: Game) {
        super.updateState(game);
        const { HUD } = game;

        HUD.clearRect(0, 0, game.canvas.width, game.canvas.height);
        if (this.spawnParticles && this.checkCounter(1)) {
            const position = new Vector(game.canvas.width / 4, game.canvas.height / 4);

            game.particlesFactory.generateFireflies(1000, 3, 0.25, position, HUD);

            this.resetCounter();
        }

        game.particlesManager.update();
    }

    exitState(game: Game) {
        game.htmlHandlers.eventRemover();
        const { audio } = game;
        audio.stopAll();
    }
}
