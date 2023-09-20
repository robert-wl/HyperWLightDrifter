import GameBaseState from './GameBaseState.js';
import firefliesSpawner from '../../../helper/renderer/firefliesSpawner.js';
import {getImage, imageLoader} from "../../../helper/imageLoader.js";
import GameSettings from "../../../constants.js";
import Judgement from "../../enemy/judgement/Judgement.js";

export default class GameStageTwoState extends GameBaseState {
    async enterState(game) {

        game.stage = 2;
        await this.stageInitializer(game);

    }

    updateState(game) {

        game.pauseHandler();

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

    async stageInitializer(game) {
        game.prepareCanvas();

        await imageLoader(GameSettings.IMAGES.STAGE_TWO);

        const { camera, player, elevator } = game;

        const mapGround = getImage('map_ground_second');

        camera.init({
            lowerBackground: mapGround,
            topBackground: null,
        })

        camera.lowerBackground = mapGround;
        camera.topBackground = null;

        // Judgement.generate({ x: 900, y: 400, collideable: true });

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

        camera.position.x = 0;
        camera.position.y = 0;


        elevator.changeStage();
        const oldYPosition = player.centerPosition.y;

        elevator.x += 23;
        player.centerPosition.x += 23;


        camera.setCameraPosition({
            position: {
                x: player.centerPosition.x,
                y: 300,
            }
        });

        //971.1727663816865, y: 197.45720130794825

        const yDiff = oldYPosition - elevator.y;
        elevator.y = 0;
        player.centerPosition.y = yDiff;


        game.changeState();

        // for (const collider of colliders) {
        //     Collideable.generate(collider);
        // }
        //
        // const medkits = [
        //     { x: 1400, y: 300 },
        //     { x: 1400, y: 800 },
        //     { x: 400, y: 500 },
        // ];
        //
        // for (const medkit of medkits) {
        //     Medkit.generate(medkit);
        // }
    }
}
