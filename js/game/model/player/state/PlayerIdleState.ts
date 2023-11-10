import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import Player from '../Player.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerIdleState extends PlayerBaseState {
    updateState(currPlayer: Player) {
        currPlayer.regenerateStamina();

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }

    drawImage(currPlayer: Player) {
        let idleImage: HTMLImageElement | null = null;
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

        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: idleImage.width * GameSettings.GAME.GAME_SCALE,
            h: idleImage.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(idleImage, imageSize, true);
    }
}
