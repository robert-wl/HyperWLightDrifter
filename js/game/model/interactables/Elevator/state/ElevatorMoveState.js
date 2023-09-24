import ElevatorBaseState from './ElevatorBaseState.js';
import Game from '../../../Game/Game.js';
import { getImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';
import { drawImageCropped } from '../../../../helper/renderer/drawer.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';


export default class ElevatorMoveState extends ElevatorBaseState {
    enterState(elevator) {
        const { player } = Game.getInstance();
        player.switchState(player.inElevatorState);
        this.acceleration = 0;
        this.aboutToMount = false;
        this.number = 49;
    }

    updateState(elevator) {
        this.number += 1;

        if (this.number % 100 === 0) {
            AudioPlayer.getInstance().playAudio('elevator/move.wav');
        }
        const { player, camera } = Game.getInstance();

        this.handleAcceleration(elevator);

        elevator.y += this.acceleration;
        player.centerPosition.y += this.acceleration;
        elevator.travelDistance += this.acceleration;

        if (this.aboutToMount) {
            elevator.bottomCrop += this.acceleration * 0.415;
        }

        if (elevator.stageLocation === 2) {
            camera.moveCameraPosition({
                direction: {
                    y: this.acceleration,
                },
            });
        }

        if (this.acceleration === 0) {
            elevator.switchState(elevator.mountedDownState);
        }
    }


    handleAcceleration(elevator) {

        if (elevator.stageLocation === 2 && elevator.travelDistance > 620) {
            this.acceleration -= 0.05;

            if (elevator.travelDistance > 681) {
                this.aboutToMount = true;
            }

            if (this.acceleration <= 0) {
                this.acceleration = 0;
            }

            return;
        }
        this.acceleration += 0.1;

        if (this.acceleration > 3) {
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
        });
    }
}
