import PlayerBaseState from './PlayerBaseState.js';
import Grenade from '../Grenade.js';
import Game from '../../Game/Game.js';
import { getFaceDirection, getMouseDirection } from '../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import { getNumberedImage } from '../../../helper/assets/assetGetter.js';

export default class PlayerThrowingState extends PlayerBaseState {
    enterState(currPlayer) {
        super.enterState(currPlayer);

        this.hasThrown = false;
        this.direction = getMouseDirection({
            angle: currPlayer.lookAngle,
        });
        const { audio } = Game.getInstance();

        audio.playAudio('player/grenade/throw.wav');
    }

    updateState(currPlayer) {
        super.updateState(currPlayer);

        this.advanceAnimationStage(5);

        if (this.animationStage >= 4 && !this.hasThrown) {
            Grenade.generate({
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                angle: currPlayer.lookAngle,
            });
            this.hasThrown = true;
        }

        if (this.animationStage < 8) {
            return;
        }

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }

    drawImage(currPlayer) {
        let playerThrow = null;

        const { centerPosition, lookAngle } = currPlayer;
        if (this.direction === 'a' || this.direction === 'd') {
            playerThrow = getNumberedImage('player_throw_side', this.animationStage);
        }
        if (this.direction === 'w') {
            playerThrow = getNumberedImage('player_throw_up', this.animationStage);
        }
        if (this.direction === 's') {
            playerThrow = getNumberedImage('player_throw_down', this.animationStage);
        }

        drawImage({
            img: playerThrow,
            x: centerPosition.x,
            y: centerPosition.y,
            width: playerThrow.width * GameSettings.GAME.GAME_SCALE,
            height: playerThrow.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(lookAngle) === 'left',
        });
    }
}
