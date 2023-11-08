import GameBaseState from './GameBaseState.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';
export default class GameLoseState extends GameBaseState {
    constructor() {
        super();
        this.transparency = 1;
    }
    enterState(game) {
        super.enterState(game);
        this.transparency = 1;
        AudioPlayer.getInstance().disableSound();
    }
    updateState(game) {
        super.updateState(game);
        const { ctx, camera, player, enemyManager } = game;
        if (this.checkCounter(250)) {
            this.transparency -= 0.01;
        }
        if (this.transparency < -1) {
            game.switchState(game.startState);
            return;
        }
        game.setFilter('hue-rotate(90deg)');
        game.setTransparency(this.transparency);
        game.setTransparency(this.transparency, game.HUD);
        ctx.clearRect(camera.position.x, camera.position.y, game.canvas.width, game.canvas.height);
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
        game.htmlHandlers.notify('loseGameFinished');
    }
}
