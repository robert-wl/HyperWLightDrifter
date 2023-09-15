import GameBaseState from './GameBaseState.js';
import { secondStage } from '../../../helper/stages/stageHandler.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';
import EnemyManager from '../../enemy/EnemyManager.js';
import ParticlesManager from '../../particles/ParticlesManager.js';

export default class GameStageTwoState extends GameBaseState {
    async enterState(game) {
        await secondStage({
            game: game,
        });

        const { camera } = game;

        camera.setCameraPosition({
            position: game.player.centerPosition,
        });
    }

    updateState(game) {
        const { ctx, camera, player, boss, bossEntities } = game;
        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        camera.shakeCamera();

        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        game.enemySpawnHandler();

        firefliesSpawner();

        EnemyManager.getInstance().update();

        game.collideables.forEach((collideable) => collideable.update());

        player.updateState();

        camera.renderTopBackground();

        boss?.update();
        bossEntities?.forEach((entity) => entity.update());

        // game.elevator?.update();

        game.drawHUD();

        camera.resetShakeCamera();
        camera.updateCamera();
    }
}
