import GameBaseState from './GameBaseState.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';
import ParticlesManager from '../../particles/ParticlesManager.js';
import InteractionBar from '../../interactables/InteractionBar.js';
import Game from '../Game.js';
import { getImage, imageLoader } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';
import Elevator from '../../interactables/Elevator/Elevator.js';
import Door from '../../interactables/Door.js';
import Collideable from '../../collideable/Collideable.js';
import Medkit from '../../interactables/Medkit.js';
import PauseModal from '../../modal/PauseModal.js';

export default class GameStageOneState extends GameBaseState {
    async enterState(game) {
        game.stage = 1;
        await this.stageInitializer(game);

        const { audio } = game;

        PauseModal.handleInteraction();

        audio.playAudio('forest_stage/background.ogg', null, true);
    }

    updateState(game) {
        game.pauseHandler();

        const { ctx, camera, player, enemyManager, elevator } = game;

        ctx.clearRect(0, 0, game.canvas.width * 2, game.canvas.height * 2);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, game.canvas.width * 2, game.canvas.height * 3);

        camera.shakeCamera();

        elevator.update();

        if (player.currState?.isBelowGround) {
            player.updateState();
        }
        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        game.enemySpawnHandler();

        firefliesSpawner();

        enemyManager.update();

        game.collideables.forEach((collideable) => collideable.update());

        if (!player.currState?.isBelowGround) {
            player.updateState();
        }

        game.setTransparency(game.backgroundOpacity);
        camera.renderTopBackground();
        game.setTransparency(1);

        camera.updateCamera();
        camera.resetShakeCamera();

        ParticlesManager.getInstance().update();
        game.collideables.forEach((collideable) => {
            if (collideable.detectInteraction) {
                collideable.detectInteraction();
            }
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
        await imageLoader(GameSettings.IMAGES.STAGE_ONE);

        const mapGround = getImage('map_ground');
        const mapTop = getImage('map_top');

        camera.init({
            lowerBackground: mapGround,
            topBackground: mapTop,
        });
        player.centerPosition = {
            x: 950 + player.width / 2,
            y: 500 + player.height / 2,
        };

        Elevator.generate({
            x: 950,
            y: 2011,
        });

        Door.generate({
            x: 904,
            y: 1040,
            collideable: true,
        });

        const colliders = [
            { x: 100, y: 0, w: 300, h: 1000 },
            { x: 400, y: 0, w: 1025, h: 300 },
            { x: 1425, y: 0, w: 300, h: 1000 },
            { x: 100, y: 1050, w: 800, h: 500 },
            { x: 1000, y: 1050, w: 800, h: 500 },
            { x: 100, y: 1550, w: 530, h: 800 },
            { x: 1250, y: 1550, w: 530, h: 800 },
            { x: 630, y: 2150, w: 620, h: 800 },
        ];

        colliders.forEach((collider) => {
            Collideable.generate(collider);
        });

        const medkits = [
            { x: 1400, y: 300 },
            { x: 1400, y: 800 },
            { x: 400, y: 500 },
        ];

        medkits.forEach((medkit) => {
            Medkit.generate(medkit);
        });

        game.prepareCanvas();

        camera.setCameraPosition({
            position: game.player.centerPosition,
        });
    }
}
