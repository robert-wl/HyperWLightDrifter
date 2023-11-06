import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import { drawImage } from '../../../helper/renderer/drawer.js';
import Game from '../../game/Game.js';
import { getImage } from '../../../helper/assets/assetGetter.js';

export default class PlayerInElevatorState extends PlayerBaseState {
    isBelowGround = false;
    initialPosition = {};

    enterState(currPlayer) {
        currPlayer.velocity.x = 0;
        currPlayer.velocity.y = 0;
        this.initialPosition = { ...currPlayer.centerPosition };
    }

    updateState(currPlayer) {
        if (currPlayer.centerPosition.y - this.initialPosition.y > 10) {
            this.isBelowGround = true;
        }

        if (currPlayer.centerPosition.y - this.initialPosition.y > 300) {
            const { deltaTime } = Game.getInstance();
            Game.getInstance().darkenBackground(0.0025 * deltaTime);
        }
    }

    drawImage(currPlayer) {
        const moveDown = getImage('idle_down');

        drawImage({
            img: moveDown,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: moveDown.width * GameSettings.GAME.GAME_SCALE,
            height: moveDown.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
        });
    }
}
