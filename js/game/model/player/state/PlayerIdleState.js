import PlayerBaseState from './PlayerBaseState.js';
import Game from '../../Game/Game.js';
import { getImage } from '../../../helper/imageLoader.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';

const size = 1;
export default class PlayerIdleState extends PlayerBaseState {
    updateState(currPlayer) {
        if (currPlayer.stamina < 100) {
            currPlayer.stamina += 0.5;
        }
        if (currPlayer.counter !== 6) {
            return;
        }

        const { keys } = Game.getInstance();

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }
    drawImage(currPlayer) {
        if (currPlayer.lastDirection === 'd') {
            const idleRight = getImage('idle_right');

            drawImage({
                img: idleRight,
                x: currPlayer.position.x,
                y: currPlayer.position.y,
                width: idleRight.width * GameSettings.GAME.GAME_SCALE,
                height: idleRight.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        } else if (currPlayer.lastDirection === 'a') {
            const idleLeft = getImage('idle_left');

            drawImage({
                img: idleLeft,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: idleLeft.width * GameSettings.GAME.GAME_SCALE,
                height: idleLeft.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        } else if (currPlayer.lastDirection === 's') {
            const idleDown = getImage('idle_down');

            drawImage({
                img: idleDown,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: idleDown.width * GameSettings.GAME.GAME_SCALE,
                height: idleDown.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        } else if (currPlayer.lastDirection === 'w') {
            const idleUp = getImage('idle_up');

            drawImage({
                img: idleUp,
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                width: idleUp.width * GameSettings.GAME.GAME_SCALE,
                height: idleUp.height * GameSettings.GAME.GAME_SCALE,
                translate: true,
            });
        }
    }
}
