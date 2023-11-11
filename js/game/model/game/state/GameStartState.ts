import GameBaseState from './GameBaseState.js';
import Game from '../Game.js';
import GameSettings from '../../../constants.js';
import Navbar from '../../htmlElements/Navbar.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import AudioManager from '../../utility/manager/AudioManager.js';

export default class GameStartState extends GameBaseState {
    private spawnParticles: boolean;

    constructor() {
        super();
        this.spawnParticles = false;
    }

    async enterState(game: Game) {
        super.enterState(game);

        AudioManager.enableSound();
        AudioManager.stopAll();
        Navbar.open();
        this.spawnParticles = true;

        game.toggleFullscreen(false);
        game.prepareCanvas();

        await game.init();

        game.htmlHandlers.notify('startScreen');
        game.changeState();
        await AssetManager.assetLoader([GameSettings.ASSETS.SPAWN], undefined, false);

        AudioManager.playAudio('menu_background_audio', true).then();
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
        AudioManager.stopAll();
    }
}
