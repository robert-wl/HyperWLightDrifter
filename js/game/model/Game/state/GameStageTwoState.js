import GameBaseState from './GameBaseState.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';
import { getImage, imageLoader } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';
import Judgement from '../../enemy/judgement/Judgement.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';
import Collideable from '../../collideable/Collideable.js';

export default class GameStageTwoState extends GameBaseState {
    hasBossSpawned = false;

    async enterState(game) {
        AudioPlayer.getInstance().stopAll();
        game.stage = 2;
        await this.stageInitializer(game);
        this.hasBossSpawned = false;
    }

    updateState(game) {
        game.pauseHandler();

        const { ctx, camera, player, enemyManager, backgroundOpacity, elevator } = game;

        if (player.currState === player.inElevatorState && player.currState.isBelowGround) {
            game.brightenBackground();

            if (backgroundOpacity === 1) {
                // player.switchState(player.idleState)
            }
        }

        if (elevator.currState === elevator.mountedDownState && !this.hasBossSpawned) {
            Judgement.generate({ x: 850, y: 100, collideable: true });
            this.hasBossSpawned = true;
        }

        ctx.clearRect(0, 0, game.canvas.width * 2, game.canvas.height * 3);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, game.canvas.width * 2, game.canvas.height * 3);
        camera.shakeCamera();

        if (elevator.currState === elevator.mountedDownState) {
            game.setTransparency(game.backgroundOpacity);
            elevator?.update();
            game.setTransparency(1);
        }
        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);

        if (elevator.currState === elevator.moveState) {
            elevator?.update();
        }

        game.enemySpawnHandler();

        firefliesSpawner();

        enemyManager.update();

        game.collideables.forEach((collideable) => collideable.update());

        if (!enemyManager.boss || enemyManager.boss.currState !== enemyManager.boss.deathState) {
            player.updateState();
        }

        // camera.renderTopBackground();

        game.drawHUD();
        enemyManager.updateBoss();

        enemyManager.updateBossEntities();

        camera.resetShakeCamera();
        camera.updateCamera();
    }

    async stageInitializer(game) {
        game.prepareCanvas();
        game.changeState();
        await imageLoader([GameSettings.IMAGES.STAGE_TWO, GameSettings.IMAGES.PLAYER]);

        const { camera, player, elevator } = game;

        game.keys = [];
        game.clicks = [];
        const mapGround = getImage('map_ground_second');

        camera.init({
            lowerBackground: mapGround,
            topBackground: null,
        });

        camera.lowerBackground = mapGround;
        camera.topBackground = null;

        const colliders = [
            { x: 100, y: 0, w: 370, h: 1000 },
            { x: 470, y: 0, w: 995, h: 350 },
            { x: 1465, y: 0, w: 300, h: 1000 },
            { x: 100, y: 1000, w: 1664, h: 500 },
        ];

        colliders.forEach((collider) => {
            Collideable.generate(collider);
        });

        camera.position.x = 0;
        camera.position.y = 0;

        elevator.changeStage();
        const oldYPosition = player.centerPosition.y;

        elevator.x += 22;
        player.centerPosition.x += 22;

        camera.setCameraPosition({
            position: {
                x: player.centerPosition.x,
                y: 320,
            },
        });

        const yDiff = oldYPosition - elevator.y;
        elevator.y = 0;
        player.centerPosition.y = yDiff;
    }
}
