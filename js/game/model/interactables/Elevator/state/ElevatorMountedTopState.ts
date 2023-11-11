import ElevatorBaseState from './ElevatorBaseState.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import Elevator from '../Elevator.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class ElevatorMountedTopState extends ElevatorBaseState {
    public drawImage(elevator: Elevator) {
        const elevatorImage = AssetManager.getImage('elevator');
        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;

        const imageSize = Box.parse({
            x: elevator.position.x - elevatorImage.width,
            y: elevator.position.y - elevatorImage.height,
            w: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            h: elevatorImage.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(elevatorImage, imageSize);

        if (Game.getInstance().coinCount >= 10) {
            return;
        }

        const lock = AssetManager.getImage('lock');
        const imageLockSize = Box.parse({
            x: elevator.position.x - elevatorImage.width + 15,
            y: elevator.position.y - elevatorImage.height + 7,
            w: lock.width * GameSettings.GAME.GAME_SCALE,
            h: lock.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(lock, imageLockSize);
    }
}
