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

        if (currPlayer.stamina < 100) {
            currPlayer.stamina += 0.5;
        }

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
        if (this.direction === 'w') {
            const moveUp = getNumberedImage('move_up', (this.animationStage % 12) + 1);
            drawImage({
                img: moveUp,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: moveUp.width * GameSettings.GAME.GAME_SCALE,
                height: moveUp.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });

            return;
        }
        if (this.direction === 'a') {
            const moveSide = getNumberedImage('move_left', (this.animationStage % 12) + 1);

            drawImage({
                img: moveSide,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: moveSide.width * GameSettings.GAME.GAME_SCALE,
                height: moveSide.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });

            return;
        }
        if (this.direction === 's') {
            const moveDown = getNumberedImage('move_down', (this.animationStage % 12) + 1);

            drawImage({
                img: moveDown,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: moveDown.width * GameSettings.GAME.GAME_SCALE,
                height: moveDown.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });

            return;
        }
        if (this.direction === 'd') {
            const moveSide = getNumberedImage('move_right', (this.animationStage % 12) + 1);

            drawImage({
                img: moveSide,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: moveSide.width * GameSettings.GAME.GAME_SCALE,
                height: moveSide.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        }
    }
}
