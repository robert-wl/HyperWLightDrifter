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
        game.prepareCanvas();

        const { camera, player, elevator } = game;

        camera.position.x = 0;
        camera.position.y = 0;

        player.centerPosition.x += 65;
        // elevator.position.x += 200;


        camera.setCameraPosition({
            position: { ...player.centerPosition }
        });

        const yPosition = elevator.position.y + 500
        elevator.position.y = -yPosition;
        player.centerPosition.y -= yPosition;
        //

        game.changeState();
    }

    updateState(game) {
        const { ctx, camera, player, boss, bossEntities, enemyManager, backgroundOpacity, elevator } = game;

        if(player.currState === player.inElevatorState && player.currState.isBelowGround) {
            game.brightenBackground();

            if(backgroundOpacity === 1) {
                // player.switchState(player.idleState)
            }
        }



        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        camera.shakeCamera();

        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        elevator?.update();

        game.enemySpawnHandler();

        firefliesSpawner();

        enemyManager.update();

        game.collideables.forEach((collideable) => collideable.update());

        player.updateState();

        // camera.renderTopBackground();

        boss?.update();
        bossEntities?.forEach((entity) => entity.update());

        // game.elevator?.update();

        game.drawHUD();

        camera.resetShakeCamera();
        camera.updateCamera();
    }
}
