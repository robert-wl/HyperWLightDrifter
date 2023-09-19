import {getNumberedImage} from "../../helper/imageLoader.js";
import {drawImage} from "../../helper/renderer/drawer.js";
import GameSettings from "../../constants.js";
import Game from "../Game/Game.js";
import {getMagnitudeValue} from "../../helper/distanceHelper.js";
import Medkit from "./Medkit.js";
import Elevator from "./Elevator.js";


export default class InteractionBar {
    static animationStage = 1;
    static number = 0;
    static transparency = 0;
    static setAllowDraw(boolean) {
        this.allowDraw = boolean;
    }
    static setTransparency(transparency) {
        this.transparency = transparency;
    }
    static setInteractionStage(stage) {
        this.interactionStage = stage;
    }

    static handler(object) {
        const { player, keys, audio } = Game.getInstance();

        if (keys.includes('e') && this.transparency >= 0.5) {
            this.number += 1;

            object.interactionStage++;

            if (object.interactionStage === 20) {
                if (object instanceof Medkit) {
                    player.healing = 6;
                }
                return true;
            }

            if (this.number % 7 === 0) {
                audio.playAudio('player/interact/interact.wav');
            }

            if (this.number % 10 === 0) {
                this.animationStage = (this.animationStage % 3) + 2;
            }
        }
        else {
            if (object.interactionStage > 0) {
                object.interactionStage -= 1;
            }
        }
        this.interactionStage = object.interactionStage;

        return false;
    }


    static detectPlayerInteraction(object, interactDistance = 100) {
        const { player } = Game.getInstance();

        const distance = getMagnitudeValue({
            x: player.centerPosition.x - (object.x + object.width / 2),
            y: player.centerPosition.y - (object.y + object.height / 2),
        });


        if (distance < interactDistance) {
            InteractionBar.setAllowDraw(true);
            this.transparency = Math.abs(distance - interactDistance) / interactDistance;
            if (this.handler(object)) {
                object.activate();
            }
        } else {
            player.interactionStage = 0;
        }
    }
    static drawBar() {
        if(!this.allowDraw){
            return;
        }
        const { player, ctx } = Game.getInstance();
        const interactionBar = getNumberedImage('interaction_bar', this.animationStage);

        Game.getInstance().setTransparency(this.transparency);

        drawImage({
            img: interactionBar,
            x: player.centerPosition.x + 50,
            y: player.centerPosition.y - 10,
            width: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            height: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });

        ctx.fillStyle = 'rgb(255, 255, 255, 0.9)';

        ctx.fillRect(player.centerPosition.x + 54, player.centerPosition.y - 2, this.interactionStage, 16);

        Game.getInstance().setTransparency(1);
        this.allowDraw = false;

    }
}
