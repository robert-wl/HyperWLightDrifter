import PlayerBaseState from './PlayerBaseState.js';
import { getImage, getNumberedImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';

const scale = 2;
export default class PlayerHurtState extends PlayerBaseState {
    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 0;
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
        });
    }
}
