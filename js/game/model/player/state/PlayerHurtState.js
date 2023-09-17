import PlayerBaseState from './PlayerBaseState.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import { getMoveDirection } from '../../../helper/collision/directionHandler.js';
import { getRandomBoolean } from '../../../helper/randomHelper.js';
import Game from "../../Game/Game.js";

const scale = 2;
export default class PlayerHurtState extends PlayerBaseState {
    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 0;
        this.mirrored = this.mirroredHandler(currPlayer);

        const { audio } = Game.getInstance();
        audio.playAudio('player/hurt.wav');
    }
    updateState(currPlayer) {
        this.number++;

        if (this.number % 10 === 0) {
            this.animationStage++;
        }
        if (this.animationStage === 3) {
            currPlayer.handleSwitchState({
                move: true,
                idle: true,
                attackOne: true,
                dash: true,
                aim: true,
                throws: true,
            });
        }
    }
    drawImage(currPlayer) {
        const playerHurt = getNumberedImage('player_hurt', this.animationStage + 1);

        drawImage({
            img: playerHurt,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: playerHurt.width * GameSettings.GAME.GAME_SCALE,
            height: playerHurt.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: this.mirrored,
        });

    }

    mirroredHandler(currPlayer) {
        const { direction } = getMoveDirection({ currPlayer });

        if (direction === 'w' || direction === 's' || direction === '') {
            return getRandomBoolean(0.5);
        }
        return direction === 'a';
    }
}
