import GameBaseState from './GameBaseState.js';
import { secondStage } from '../../../helper/stages/stageHandler.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';

export default class GameStageTwoState extends GameBaseState {
    async enterState(game) {
        await secondStage({
            game: game,
        });
        game.prepareCanvas();

        const { camera, player, elevator } = game;

        camera.position.x = 0;
        camera.position.y = 0;


        elevator.changeStage();
        const oldYPosition = player.centerPosition.y;

        elevator.x += 23;
        player.centerPosition.x += 23;


        camera.setCameraPosition({
            position: {
                x: 930 + player.width / 2,
                y: 550 + player.height / 2,
            }
        });

        const yDiff = oldYPosition - elevator.y;
        elevator.y = 0;
        player.centerPosition.y = yDiff;
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

        if(elevator.currState === elevator.mountedDownState) {
            elevator?.update();

        }
        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        if(elevator.currState === elevator.moveState) {
            elevator?.update();
        }

        game.enemySpawnHandler();

        firefliesSpawner();

        enemyManager.update();

        game.collideables.forEach((collideable) => collideable.update());

        player.updateState();

        // camera.renderTopBackground();

        boss?.update();
        bossEntities?.forEach((entity) => entity.update());


        game.drawHUD();

        camera.resetShakeCamera();
        camera.updateCamera();
    }
}
