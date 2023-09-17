import GameBaseState from "./GameBaseState.js";
import ParticlesManager from "../../particles/ParticlesManager.js";
import Fireflies from "../../particles/Fireflies.js";
import {imageLoader} from "../../../helper/imageLoader.js";
import GameSettings from "../../../constants.js";
import menuHandler from "../../../ui/menuHandler.js";
import AudioPlayer from "../../../../audio/AudioPlayer.js";


export default class GameStartState extends GameBaseState {
    async enterState(game) {
        await game.init();
        await imageLoader(GameSettings.IMAGES.SPAWN);
        this.number = 0;
        this.spawnParticles = true;
        menuHandler();

        const { audio } = game;
        audio.allowSound = true;
        audio.playAudio('menu/background.ogg', null, true);

        $('#opening-screen')
            .css('opacity', '100%')
            .css('display', 'block');
    }

    updateState(game) {
        this.number += 1;
        const { HUD } = game;

        HUD.clearRect(0, 0, game.canvas.width, game.canvas.height);
        if(this.spawnParticles) {
            Fireflies.generate({
                canvas: HUD,
                distance: 1000,
                position: {
                    x: game.canvas.width / 4,
                    y: game.canvas.height / 4,
                },
                speed: 0.25,
                lifespan: 3,
            });
        }

        ParticlesManager.getInstance().update();
    }

    exitState(game) {
        const { audio } = game;
        audio.stopAll();
    }

}
