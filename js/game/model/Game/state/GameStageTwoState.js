import GameBaseState from './GameBaseState.js';
import { getImage, imageLoader } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';
import Judgement from '../../enemy/judgement/Judgement.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';
import Collider from '../../collideable/Collider.js';

const colliders = [
    { x: 100, y: 0, width: 370, height: 1000 },
    { x: 470, y: 0, width: 995, height: 350 },
    { x: 1465, y: 0, width: 300, height: 1000 },
    { x: 100, y: 1000, width: 1664, height: 500 },
];
export default class GameStageTwoState extends GameBaseState {
    async enterState(game) {
        this.hasInitialized = false;
        this.colliders = [];
        AudioPlayer.getInstance().stopAll();
        game.stage = 2;
        await this.stageInitializer(game);
        this.hasBossSpawned = false;
        this.hasInitialized = true;
    }

    updateState(game) {
        if (!this.hasInitialized) {
            return;
        }
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

        if (!enemyManager.boss || enemyManager.boss.currState !== enemyManager.boss.deathState) {
            player.updateState(this.colliders);
        }

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

        const { camera, player, elevator, enemyManager } = game;

        enemyManager.clearEntities();

        game.keys = [];
        game.clicks = [];
        const mapGround = getImage('map_ground_second');

        camera.init(new Map().set('0,0', mapGround));

        colliders.forEach((collider) => {
            this.colliders.push(new Collider(collider));
        });
        elevator.changeStage();
        const oldYPosition = player.centerPosition.y;

        elevator.position.x = 970;
        player.centerPosition.x = 960;

        camera.followTarget = elevator;
        camera.switchState(camera.followState);

        camera.setCameraPosition({
            position: {
                x: player.centerPosition.x,
                y: 320,
            },
        });

        const yDiff = oldYPosition - elevator.position.y;
        elevator.position.y = 0;
        player.centerPosition.y = yDiff;
    }
}
