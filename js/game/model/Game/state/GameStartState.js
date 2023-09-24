import GameBaseState from './GameBaseState.js';
import ParticlesManager from '../../particles/ParticlesManager.js';
import Fireflies from '../../particles/Fireflies.js';
import menuHandler from '../../../ui/menuHandler.js';
import Game from '../Game.js';
import MenuModal from '../../modal/MenuModal.js';
import SelectionModal from '../../modal/SelectionModal.js';
import SettingsModal from '../../modal/SettingsModal.js';
import { imageLoader } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';

export default class GameStartState extends GameBaseState {
    async enterState(game) {
        super.enterState(game);
        this.spawnParticles = true;

        game.instance = null;

        Game.getInstance();

        await game.init();

        game.prepareCanvas();
        game.changeState();
        await imageLoader(GameSettings.IMAGES.SPAWN);
        MenuModal.handleInteraction();
        SelectionModal.handleInteraction();
        SettingsModal.handleInteraction();

        menuHandler();

        const { audio } = game;

        audio.allowSound = true;
        audio.playAudio('menu/background.ogg', null, true);

        $('#opening-screen').css('opacity', '100%').css('display', 'block');
    }

    updateState(game) {
        super.updateState(game);
        const { HUD } = game;

        HUD.clearRect(0, 0, game.canvas.width, game.canvas.height);
        if (this.spawnParticles && this.checkCounter(1)) {
            Fireflies.generate({
                canvas: HUD,
                distance: 1000,
                position: {
                    x: game.canvas.width / 4,
                    y: game.canvas.height / 4,
                },
                speed: 0.25,
                lifespan: 3,
            });

            this.resetCounter();
        }

        ParticlesManager.getInstance().update();
    }

    exitState(game) {
        const { audio } = game;
        audio.stopAll();
    }
}
