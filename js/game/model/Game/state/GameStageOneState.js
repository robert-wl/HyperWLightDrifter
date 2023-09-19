import GameBaseState from "./GameBaseState.js";
import firefliesSpawner from "../../../helper/renderer/firefliesSpawner.js";
import ParticlesManager from "../../particles/ParticlesManager.js";
import {firstStage} from "../../../helper/stages/stageHandler.js";
import InteractionBar from "../../interactables/InteractionBar.js";
import Game from "../Game.js";


export default class GameStageOneState extends GameBaseState {
    async enterState(game) {
        $("#menu-modal").css("display", "none");
        await firstStage();
        game.prepareCanvas();

        const { camera, audio } = game


        camera.setCameraPosition({
            position: game.player.centerPosition,
        });

        audio.playAudio('forest_stage/background.ogg', null, true);
    }

    updateState(game) {
        const { ctx, camera, player, enemyManager, elevator } = game;

        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, game.canvas.width, game.canvas.height * 2);

        camera.shakeCamera();

        elevator.update();

        if(player.currState?.isBelowGround) {
            player.updateState();
        }
        game.setTransparency(game.backgroundOpacity);
        camera.renderLowerBackground();
        game.setTransparency(1);


        game.enemySpawnHandler();

        firefliesSpawner();


        enemyManager.update();

        game.collideables.forEach((collideable) => collideable.update());

        if(!player.currState?.isBelowGround) {
            player.updateState();
        }

        game.setTransparency(game.backgroundOpacity);
        camera.renderTopBackground();
        game.setTransparency(1);

        camera.updateCamera();
        camera.resetShakeCamera();

        ParticlesManager.getInstance().update();
        game.collideables.forEach((collideable) => {
            if(collideable.detectInteraction) {
                collideable.detectInteraction()
            }
        });

        InteractionBar.drawBar();

        game.drawHUD();
        this.handleStageChange(game);
    }

    handleStageChange(game) {
        const { player, backgroundOpacity } = Game.getInstance();
        if(player.currState?.isBelowGround && backgroundOpacity === 0) {
            game.switchState(game.stageTwoState);
        }
    }
}
