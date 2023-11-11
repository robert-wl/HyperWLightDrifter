var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import GameBaseState from './GameBaseState.js';
import GameSettings from '../../../constants.js';
import Navbar from '../../htmlElements/Navbar.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import AudioManager from '../../utility/manager/AudioManager.js';
export default class GameStartState extends GameBaseState {
    constructor() {
        super();
        this.spawnParticles = false;
    }
    enterState(game) {
        const _super = Object.create(null, {
            enterState: { get: () => super.enterState }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.enterState.call(this, game);
            AudioManager.enableSound();
            AudioManager.stopAll();
            Navbar.open();
            this.spawnParticles = true;
            game.toggleFullscreen(false);
            game.prepareCanvas();
            yield game.init();
            game.htmlHandlers.notify('startScreen');
            game.changeState();
            yield AssetManager.assetLoader([GameSettings.ASSETS.SPAWN]);
            AudioManager.playAudio('menu_background_audio', true);
        });
    }
    updateState(game) {
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
    exitState(game) {
        game.htmlHandlers.eventRemover();
        AudioManager.stopAll();
    }
}
