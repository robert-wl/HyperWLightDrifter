import PlayerBaseState from './PlayerBaseState.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';

export default class PlayerSpawnState extends PlayerBaseState {
    enterState(currPlayer) {
        this.animationStage = 0;
        this.number = 0;
    }

    updateState(currPlayer) {
        this.number += 1;

        if(this.number % 7 === 0) {
            this.animationStage += 1;
        }

        if(this.animationStage === 9) {
            currPlayer.switchState(currPlayer.idleState)
        }
    }

    drawImage(currPlayer) {
        const playerSpawn = getNumberedImage('player_spawn', (this.animationStage % 9) + 1);

        drawImage({
            img: playerSpawn,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y - playerSpawn.height / 1.45,
            width: playerSpawn.width * GameSettings.GAME.GAME_SCALE,
            height: playerSpawn.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
