import PlayerBaseState from './PlayerBaseState.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../helper/collision/directionHandler.js';
import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';
import Player from '../Player.js';
import AssetManager from '../../utility/AssetManager.js';

export default class PlayerDeathState extends PlayerBaseState {
    enterState(currPlayer: Player) {
        super.enterState(currPlayer);

        const { loseState, audio } = Game.getInstance();
        Game.getInstance().switchState(loseState);

        audio.playAudio('player/die.wav', null, false, true);
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

        drawImage({
            img: death,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: death.width * GameSettings.GAME.GAME_SCALE,
            height: death.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currPlayer.lookAngle) === 'left',
        });
    }
}
