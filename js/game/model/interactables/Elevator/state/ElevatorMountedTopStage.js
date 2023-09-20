import ElevatorBaseState from "./ElevatorBaseState.js";
import {getImage} from "../../../../helper/imageLoader.js";
import {drawImage} from "../../../../helper/renderer/drawer.js";
import GameSettings from "../../../../constants.js";
import InteractionBar from "../../InteractionBar.js";


export default class ElevatorMountedTopState extends ElevatorBaseState {
    enterState(elevator) {

    }

    updateState(elevator) {
        InteractionBar.detectPlayerInteraction(elevator, 50);
    }

    drawImage(elevator) {
        const elevatorImage = getImage('elevator');

        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;


        drawImage({
            img: elevatorImage,
            x: elevator.x - elevatorImage.width,
            y: elevator.y - elevatorImage.height,
            width: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            height: elevatorImage.height * GameSettings.GAME.GAME_SCALE,
        })
    }
}
