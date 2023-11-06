import PlayerBaseState from './PlayerBaseState.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';

export default class PlayerSpawnState extends PlayerBaseState {
    enterState(currPlayer) {
        super.enterState(currPlayer);
        this.spawnDelay = 0;
        const { audio } = Game.getInstance();
        audio.playAudio('player/teleport_arrive.wav');
    }

    updateState(currPlayer) {
        const { deltaTime } = Game.getInstance();
        this.spawnDelay += deltaTime;

        if (this.spawnDelay < 20) {
            return;
        }

        super.updateState(currPlayer);

        this.advanceAnimationStage(5);

        if (this.animationStage === 15) {
            currPlayer.switchState(currPlayer.idleState);
        }
    }

    drawImage(currPlayer) {
        if (this.spawnDelay < 20) {
            return;
        }

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
