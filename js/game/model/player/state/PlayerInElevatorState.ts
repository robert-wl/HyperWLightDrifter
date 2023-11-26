import PlayerBaseState from './PlayerBaseState.js';
import GameSettings from '../../../constants.js';
import Game from '../../game/Game.js';
import Player from '../Player.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerInElevatorState extends PlayerBaseState {
    private initialPosition: Vector;

    constructor() {
        super();
        this.initialPosition = Vector.Zero();
    }

    enterState(currPlayer: Player) {
        currPlayer.velocity.x = 0;
        currPlayer.velocity.y = 0;
        this.initialPosition = currPlayer.centerPosition.copy();
    }

    updateState(currPlayer: Player) {
        currPlayer.regenerateStamina();
        if (currPlayer.centerPosition.y - this.initialPosition.y > 10) {
            currPlayer.isBelowGround = true;
        }

        if (currPlayer.centerPosition.y - this.initialPosition.y > 300) {
            Game.getInstance().darkenBackground(0.0025 * Game.deltaTime);
        }
    }

    drawImage(currPlayer: Player) {
        const moveDown = AssetManager.getImage('idle_down');

        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: moveDown.width * GameSettings.GAME.GAME_SCALE,
            h: moveDown.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(moveDown, imageSize, true);
    }
}
