import PlayerBaseState from './PlayerBaseState.js';
import { getMoveDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game/Game.js';
import { getNumberedImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import { getRandomValue } from '../../../helper/randomHelper.js';

export default class PlayerMoveState extends PlayerBaseState {
    animationStage = 0;
    number = 0;

    updateState(currPlayer) {
        this.number += 1;

        if (this.number % 4 === 0) {
            this.animationStage += 1;
        }

        if (this.number % 24 === 0) {
            const randomValue = getRandomValue({
                initialValue: 1,
                randomValue: 2,
                rounded: true,
            });

            const { audio } = Game.getInstance();
            audio.playAudio('player/footstep_forest.wav', randomValue);
        }

        currPlayer.regenerateStamina();

        const { direction, playerDirection } = getMoveDirection({
            currPlayer: currPlayer,
        });

        this.direction = direction;

        currPlayer.direction = playerDirection;

        if (direction) {
            currPlayer.lastDirection = direction;
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
        let moveImage = null;
        if (this.direction === 'w') {
            moveImage = getNumberedImage('move_up', (this.animationStage % 12) + 1);
        }
        if (this.direction === 'a') {
            moveImage = getNumberedImage('move_left', (this.animationStage % 12) + 1);
        }
        if (this.direction === 's') {
            moveImage = getNumberedImage('move_down', (this.animationStage % 12) + 1);
        }
        if (this.direction === 'd') {
            moveImage = getNumberedImage('move_right', (this.animationStage % 12) + 1);
        }

        if(moveImage === null) {
            return;
        }

        drawImage({
            img: moveImage,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: moveImage.width * GameSettings.GAME.GAME_SCALE,
            height: moveImage.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
