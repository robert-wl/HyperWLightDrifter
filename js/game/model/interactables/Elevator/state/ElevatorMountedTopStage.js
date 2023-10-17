import ElevatorBaseState from './ElevatorBaseState.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import InteractionBar from '../../InteractionBar.js';
import Game from '../../../Game/Game.js';

export default class ElevatorMountedTopState extends ElevatorBaseState {
    enterState(elevator) {}

    updateState(elevator) {
        const { keyCount } = Game.getInstance();

        if (keyCount < 10) {
            return;
        }
        InteractionBar.detectPlayerInteraction(elevator, 50);
    }

    drawImage(elevator) {
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
    }
}
