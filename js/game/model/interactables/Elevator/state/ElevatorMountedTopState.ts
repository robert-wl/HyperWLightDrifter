import ElevatorBaseState from './ElevatorBaseState.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import Elevator from '../Elevator.js';

export default class ElevatorMountedTopState extends ElevatorBaseState {
    public updateState(elevator: Elevator) {
        const { keyCount } = Game.getInstance();

        if (keyCount < 10) {
            return;
        }
        // InteractionBar.detectPlayerInteraction(elevator, 50);
    }

    public drawImage(elevator: Elevator) {
        const elevatorImage = getImage('elevator');

        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;

        drawImage({
            img: elevatorImage,
            x: elevator.position.x - elevatorImage.width,
            y: elevator.position.y - elevatorImage.height,
            width: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            height: elevatorImage.height * GameSettings.GAME.GAME_SCALE,
        });

        if (Game.getInstance().keyCount >= 10) {
            return;
        }

        const lock = getImage('lock');

        drawImage({
            img: lock,
            x: elevator.position.x - elevatorImage.width + 15,
            y: elevator.position.y - elevatorImage.height + 7,
            width: lock.width * GameSettings.GAME.GAME_SCALE,
            height: lock.height * GameSettings.GAME.GAME_SCALE,
        });
    }
}
