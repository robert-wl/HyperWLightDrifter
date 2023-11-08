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
import Game from '../Game.js';
import GameSettings from '../../../constants.js';
import { assetLoader } from '../../../helper/assets/assetLoader.js';
import Navbar from '../../htmlElements/Navbar.js';
import AssetManager from '../../utility/AssetManager.js';
import { Vector } from '../../utility/enums/Vector.js';
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
            Navbar.open();
            game.toggleFullscreen(false);
            this.spawnParticles = true;
            // game.instance = null;
            Game.getInstance();
            yield game.init();
            game.htmlHandlers.notify('startScreen');
            game.prepareCanvas();
            game.changeState();
            yield AssetManager.assetLoader([GameSettings.ASSETS.SPAWN]);
            yield assetLoader([GameSettings.ASSETS.SPAWN], game.htmlHandlers);
            // menuHandler();
            const { audio } = game;
            audio.allowSound = true;
            audio.playAudio('menu/background.ogg', null, true);
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
        const { audio } = game;
        audio.stopAll();
    }
}
