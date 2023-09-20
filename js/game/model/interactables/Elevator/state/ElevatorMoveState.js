import ElevatorBaseState from "./ElevatorBaseState.js";
import Game from "../../../Game/Game.js";
import {getImage} from "../../../../helper/imageLoader.js";
import GameSettings from "../../../../constants.js";
import {drawImage, drawImageCropped} from "../../../../helper/renderer/drawer.js";


export default class ElevatorMoveState extends ElevatorBaseState {
    enterState(elevator) {
        const { player } = Game.getInstance();
        player.switchState(player.inElevatorState);
        this.acceleration = 0;
        this.aboutToMount = false;
    }

    updateState(elevator) {

        const { player, camera } = Game.getInstance();

        this.handleAcceleration(elevator);
        elevator.y += this.acceleration;
        player.centerPosition.y += this.acceleration;
        player.position.y += this.acceleration;
        elevator.travelDistance += this.acceleration;

        if(this.aboutToMount) {
            elevator.bottomCrop += this.acceleration * 0.415;
        }

        console.log(GameSettings.GAME.SCREEN_HEIGHT / 2, elevator.travelDistance)
        if(elevator.stageLocation === 2) {
            camera.moveCameraPosition( {
                direction: {
                    y: this.acceleration,
                }
            })
            console.log(player.centerPosition)
        }

        if(this.acceleration === 0) {
            elevator.switchState(elevator.mountedDownState);
        }
    }


    handleAcceleration(elevator) {

        if(elevator.stageLocation === 2 && elevator.travelDistance > 620) {
            this.acceleration -= 0.05;

            if(elevator.travelDistance > 681) {
                this.aboutToMount = true;
            }

            if(this.acceleration <= 0) {
                this.acceleration = 0;
            }

            return;
        }
        this.acceleration += 0.1;

        if(this.acceleration > 3) {
            this.acceleration = 3;
        }
    }

    drawImage(elevator) {
        const elevatorImage = getImage('elevator');

        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;


        // console.log((elevatorImage.height - this.bottomCrop) * GameSettings.GAME.GAME_SCALE)
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
