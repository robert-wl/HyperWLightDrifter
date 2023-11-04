import GameBaseState from './GameBaseState.js';
import ParticlesManager from '../../particles/ParticlesManager.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';

export default class GameLoseState extends GameBaseState {
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

        enemyManager?.updateBoss();

        enemyManager?.updateBossEntities();

        camera.renderTopBackground();
        ParticlesManager.getInstance().update();

        game.drawHUD();

        camera.updateCamera();
    }

    exitState(_game) {
        $('#opening-screen').css('animation', 'fadeIn 0.5s ease-in-out');
    }
}
