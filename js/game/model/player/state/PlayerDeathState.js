import PlayerBaseState from "./PlayerBaseState.js";
import {getImage, getNumberedImage} from "../../../helper/imageLoader.js";
import {drawImage} from "../../../helper/renderer/drawer.js";
import {getFaceDirection} from "../../../helper/collision/directionHandler.js";
import GameSettings from "../../../constants.js";
import Game from "../../Game/Game.js";
import AudioPlayer from "../../../../audio/AudioPlayer.js";


export default class PlayerDeathState extends PlayerBaseState {
    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 0;

        Game.getInstance().switchState(Game.getInstance().loseState);

        AudioPlayer.getInstance().playAudio('player/death.wav', null, false, true);
    }

    updateState(currPlayer) {
        if(this.animationStage === 5) {
            return;
        }
        this.number += 1;

        if(this.number % 30 === 0) {
            console.log("hello")
            this.animationStage += 1;
        }
    }

    drawImage(currPlayer) {
        const death = getNumberedImage('player_death', this.animationStage + 1);

        drawImage({
            img: death,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: death.width * GameSettings.GAME.GAME_SCALE,
            height: death.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currPlayer.angle) === 'left',
        })
    }
}
