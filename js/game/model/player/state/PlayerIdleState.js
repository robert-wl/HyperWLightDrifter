import PlayerBaseState from './PlayerBaseState.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import AssetManager from '../../utility/AssetManager.js';
export default class PlayerIdleState extends PlayerBaseState {
    updateState(currPlayer) {
        currPlayer.regenerateStamina();
        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }
    drawImage(currPlayer) {
        let idleImage = null;
        if (currPlayer.lastDirection === 'd') {
            idleImage = AssetManager.getImage('idle_right');
        }
        if (currPlayer.lastDirection === 'a') {
            idleImage = AssetManager.getImage('idle_left');
        }
        if (currPlayer.lastDirection === 's') {
            idleImage = AssetManager.getImage('idle_down');
        }
        if (currPlayer.lastDirection === 'w') {
            idleImage = AssetManager.getImage('idle_up');
        }
        if (idleImage === null) {
            return;
        }
        drawImage({
            img: idleImage,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: idleImage.width * GameSettings.GAME.GAME_SCALE,
            height: idleImage.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
