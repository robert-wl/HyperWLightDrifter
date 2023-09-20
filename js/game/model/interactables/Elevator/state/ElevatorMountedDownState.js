import ElevatorBaseState from "./ElevatorBaseState.js";
import {getImage} from "../../../../helper/imageLoader.js";
import GameSettings from "../../../../constants.js";
import Game from "../../../Game/Game.js";
import {drawImage, drawImageCropped} from "../../../../helper/renderer/drawer.js";


export default class ElevatorMountedDownState extends ElevatorBaseState {
    enterState(elevator) {
        const { player } = Game.getInstance();
        player.switchState(player.idleState);
    }

    drawImage(elevator) {
        const elevatorImage = getImage('elevator');

        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;

        drawImageCropped({
            img: elevatorImage,
            imgX: 0,
            imgY: 0,
            imgWidth: elevatorImage.width,
            imgHeight: elevatorImage.height - elevator.bottomCrop,
            x: elevator.x - elevatorImage.width,
            y: elevator.y - elevatorImage.height,
            width: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            height: (elevatorImage.height - elevator.bottomCrop) * GameSettings.GAME.GAME_SCALE,
        })
    }
}
