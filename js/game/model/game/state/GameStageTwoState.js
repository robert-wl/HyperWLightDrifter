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
import GameSettings from '../../../constants.js';
import AudioPlayer from '../../../../audio/AudioPlayer.js';
import Collider from '../../collideable/Collider.js';
import { getImage } from '../../../helper/assets/assetGetter.js';
import { assetLoader } from '../../../helper/assets/assetLoader.js';
import AssetManager from '../../utility/AssetManager.js';
const colliders = [
    { x: 100, y: 0, width: 370, height: 1000 },
    { x: 470, y: 0, width: 995, height: 350 },
    { x: 1465, y: 0, width: 300, height: 1000 },
    { x: 100, y: 1000, width: 1664, height: 500 },
];
export default class GameStageTwoState extends GameBaseState {
    constructor() {
        super();
        this.hasInitialized = false;
        this.colliders = [];
        this.hasBossSpawned = false;
    }
    enterState(game) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hasInitialized = false;
            this.colliders = [];
            AudioPlayer.getInstance().stopAll();
            game.stage = 2;
            yield this.stageInitializer(game);
            this.hasBossSpawned = false;
            this.hasInitialized = true;
        });
    }
    updateState(game) {
        if (!this.hasInitialized) {
            return;
        }
        game.pauseHandler();
        const { ctx, camera, player, enemyManager, backgroundOpacity, elevator } = game;
        if (player.currState === player.inElevatorState && player.isBelowGround) {
            game.brightenBackground();
            if (backgroundOpacity === 1) {
                // player.switchState(player.idleState);
            }
        }
        if (elevator.currState === elevator.mountedDownState && !this.hasBossSpawned) {
            game.enemyManager.enemyFactory.generateBoss({ x: 850, y: 100 });
            this.hasBossSpawned = true;
        }
        ctx.clearRect(0, 0, game.canvas.width * 2, game.canvas.height * 3);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, game.canvas.width * 2, game.canvas.height * 3);
        camera.shakeCamera();
        if (elevator.currState === elevator.mountedDownState) {
            game.setTransparency(game.backgroundOpacity);
            elevator === null || elevator === void 0 ? void 0 : elevator.update();
            game.setTransparency(1);
        }
        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);
        if (elevator.currState === elevator.moveState) {
            elevator === null || elevator === void 0 ? void 0 : elevator.update();
        }
        if (!enemyManager.boss || !enemyManager.boss.isDead()) {
            player.updateState(this.colliders);
        }
        game.drawHUD();
        enemyManager.updateBoss();
        enemyManager.updateBossEntities();
        camera.resetShakeCamera();
        camera.updateCamera();
    }
    stageInitializer(game) {
        return __awaiter(this, void 0, void 0, function* () {
            game.prepareCanvas();
            game.changeState();
            yield AssetManager.assetLoader([GameSettings.ASSETS.STAGE_TWO, GameSettings.ASSETS.PLAYER, GameSettings.ASSETS.PLAYER]);
            yield assetLoader([GameSettings.ASSETS.STAGE_TWO, GameSettings.ASSETS.PLAYER, GameSettings.ASSETS.PLAYER], game.htmlHandlers);
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
        });
    }
}
