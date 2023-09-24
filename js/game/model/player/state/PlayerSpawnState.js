import PlayerBaseState from './PlayerBaseState.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import Game from '../../Game/Game.js';

export default class PlayerSpawnState extends PlayerBaseState {
    enterState(currPlayer) {
        super.enterState(currPlayer);
    }

    updateState(currPlayer) {
        super.updateState(currPlayer);

        if (this.checkCounter(10) && this.animationStage === 1) {
            const { audio } = Game.getInstance();
            audio.playAudio('player/teleport_arrive.wav');
        }

        this.advanceAnimationStage(10);

        if (this.animationStage === 9) {
            currPlayer.switchState(currPlayer.idleState);
        }
    }

    drawImage(currPlayer) {
        const playerSpawn = getNumberedImage('player_spawn', this.animationStage);

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
