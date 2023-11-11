import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';
import Player from '../Player.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerDeathState extends PlayerBaseState {
    private lastLookAngle: number;

    public constructor() {
        super();
        this.lastLookAngle = 0;
    }

    enterState(currPlayer: Player) {
        super.enterState(currPlayer);
        this.lastLookAngle = currPlayer.lookAngle;

        const { loseState } = Game.getInstance();
        Game.getInstance().switchState(loseState).then();

        AudioManager.playAudio('player_death_audio').then();
    }

    updateState(currPlayer: Player) {
        super.updateState(currPlayer);

        if (this.animationStage === 6) {
            return;
        }

        this.advanceAnimationStage(30);
    }

    drawImage(currPlayer: Player) {
        const death = AssetManager.getNumberedImage('player_death', this.animationStage);

        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: death.width * GameSettings.GAME.GAME_SCALE,
            h: death.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(death, imageSize, true, DirectionHelper.getFaceDirection(this.lastLookAngle) === 'left');
    }
}
