import GameBaseState from './GameBaseState.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';
import ParticlesManager from '../../particles/ParticlesManager.js';
import InteractionBar from '../../interactables/InteractionBar.js';
import Game from '../Game.js';
import { imageLoader } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';
import PauseModal from '../../modal/PauseModal.js';

export default class GameStageOneState extends GameBaseState {
    async enterState(game) {
        game.stage = 1;
        await this.stageInitializer(game);
        const { audio, player } = game;

        player.switchState(player.spawnState);

        PauseModal.handleInteraction();

        audio.playAudio('forest_stage/background.ogg', null, true);
    }

    updateState(game) {
        game.pauseHandler();
        game.mapGenerator.update();

        const { ctx, camera, player, elevators } = game;

        ctx.clearRect(camera.position.x, camera.position.y, game.canvas.width * 2, game.canvas.height * 2);
        ctx.fillStyle = '#000000';
        ctx.fillRect(camera.position.x, camera.position.y, game.canvas.width * 2, game.canvas.height * 3);

        camera.shakeCamera();

        elevators.forEach((elevator) => {
            elevator.update();
        });

        if (player.currState === player.inElevatorState) {
            player.updateState([]);
        }

        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        firefliesSpawner();
        
        game.setTransparency(game.backgroundOpacity);
        camera.renderTopBackground();
        game.setTransparency(1);

        camera.updateCamera();
        camera.resetShakeCamera();

        ParticlesManager.getInstance().update();

        game.interactables.forEach((interactable) => {
            interactable.detectInteraction();
        });
        InteractionBar.drawBar();

        game.drawHUD();
        this.handleStageChange(game);
    }

    handleStageChange(game) {
        const { player, backgroundOpacity } = Game.getInstance();
        if (player.currState?.isBelowGround && backgroundOpacity === 0) {
            game.switchState(game.stageTwoState);
        }
    }

    async stageInitializer(game) {
        $('#menu-modal').css('display', 'none');
        const { camera, player } = game;

        game.keys = [];
        game.clicks = [];

        await imageLoader([GameSettings.IMAGES.STAGE_ONE, GameSettings.IMAGES.PLAYER]);

        const positions = [{ x: 100, y: 0 }];
        game.mapGenerator.init(positions);

        camera.init();
        player.centerPosition = {
            x: 512 + player.width / 2,
            y: 512 + player.height / 2,
        };
        //
        // Elevator.generate({
        //     x: 950,
        //     y: 2011,
        // });

        game.prepareCanvas();

        camera.setCameraPosition({
            position: game.player.centerPosition,
        });
    }
}
