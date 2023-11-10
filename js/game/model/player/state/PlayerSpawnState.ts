import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';
import Player from '../Player.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerSpawnState extends PlayerBaseState {
    private spawnDelay: number;

    constructor() {
        super();
        this.spawnDelay = 0;
    }

    enterState(currPlayer: Player) {
        super.enterState(currPlayer);
        this.spawnDelay = 0;
        AudioManager.playAudio('player/teleport_arrive.wav');
    }

    updateState(currPlayer: Player) {
        this.spawnDelay += Game.deltaTime;

        if (this.spawnDelay < 20) {
            return;
        }

        super.updateState(currPlayer);

        this.advanceAnimationStage(5);

        if (this.animationStage === 15) {
            currPlayer.switchState(currPlayer.idleState);
        }
    }

    drawImage(currPlayer: Player) {
        if (this.spawnDelay < 20) {
            return;
        }

        const playerSpawn = AssetManager.getNumberedImage('player_spawn', this.animationStage);

        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y - playerSpawn.height / 1.45,
            w: playerSpawn.width * GameSettings.GAME.GAME_SCALE,
            h: playerSpawn.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(playerSpawn, imageSize, true);
    }
}
