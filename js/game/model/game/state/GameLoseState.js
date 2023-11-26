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
import AudioManager from '../../utility/manager/AudioManager.js';
export default class GameLoseState extends GameBaseState {
    constructor() {
        super();
        this.transparency = 1;
    }
    enterState(game) {
        const _super = Object.create(null, {
            enterState: { get: () => super.enterState }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.enterState.call(this, game);
            this.transparency = 1;
            AudioManager.disableSound();
        });
    }
    updateState(game) {
        super.updateState(game);
        const { camera, player, enemyManager } = game;
        if (this.checkCounter(250)) {
            this.transparency -= 0.01;
        }
        if (this.transparency < -1) {
            game.switchState(game.startState).then();
            return;
        }
        game.setFilter('hue-rotate(90deg)');
        game.setTransparency(this.transparency);
        game.setTransparency(this.transparency, game.HUD);
        game.ctx.clearRect(camera.position.x, camera.position.y, game.canvas.width, game.canvas.height);
        camera.renderLowerBackground();
        player.updateState([]);
        enemyManager === null || enemyManager === void 0 ? void 0 : enemyManager.updateBoss();
        enemyManager === null || enemyManager === void 0 ? void 0 : enemyManager.updateBossEntities();
        camera.renderTopBackground();
        game.particlesManager.update();
        game.drawHUD();
        camera.updateCamera();
    }
    exitState(game) {
        return __awaiter(this, void 0, void 0, function* () {
            game.htmlHandlers.notify('loseGameFinished');
        });
    }
}
