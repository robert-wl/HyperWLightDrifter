import ElevatorBaseState from './ElevatorBaseState.js';
import Game from '../../../Game/Game.js';
import { getImage } from '../../../../helper/imageLoader.js';
import GameSettings from '../../../../constants.js';
import { drawImageCropped } from '../../../../helper/renderer/drawer.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';

export default class ElevatorMoveState extends ElevatorBaseState {
    enterState(elevator) {
        Game.getInstance().elevator = elevator;
        const { player } = Game.getInstance();
        player.switchState(player.inElevatorState);
        this.velocity = 0;
        this.frictionCoefficient = 0.05;
        this.aboutToMount = false;
        this.bottomCropAmount = 0;
        this.counter = 0;
        this.number = 49;
    }

    updateState(elevator) {
        super.updateState(elevator);

        if (this.checkCounter(100)) {
            AudioPlayer.getInstance().playAudio('elevator/move.wav');

            this.number = 0;
        }
        const { player, camera, currState, stageTwoState } = Game.getInstance();

        this.handleVelocity(elevator);

        player.velocity.y = 0;
        if (this.counter > 100) {
            player.velocity.y = this.velocity;
        }

        player.centerPosition.y += this.velocity;
        elevator.position.y += this.velocity;
        elevator.travelDistance += this.velocity;

        if (this.aboutToMount) {
            elevator.bottomCrop += this.velocity * 0.415;
            this.bottomCropAmount += this.velocity * 0.415;
        }

        if (elevator.stageLocation === 2) {
            const { deltaTime } = Game.getInstance();
            this.counter += deltaTime;
        }

        if (this.velocity === 0) {
            elevator.switchState(elevator.mountedDownState);
        }
    }

    handleVelocity(elevator) {
        const { deltaTime } = Game.getInstance();
        if (elevator.stageLocation === 2 && elevator.travelDistance > 650) {
            this.velocity = this.velocity * (1 - this.frictionCoefficient * deltaTime);
            if (this.bottomCropAmount < 2) {
                this.velocity = 0.6;
            }

            if (elevator.travelDistance > 681) {
                this.aboutToMount = true;
            }

            if (this.velocity <= 0.01) {
                this.velocity = 0;
            }

            return;
        }

        this.velocity += 0.1 * deltaTime;

        this.velocity = Math.min(this.velocity, 3 * deltaTime);
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
            x: elevator.position.x - elevatorImage.width,
            y: elevator.position.y - elevatorImage.height,
            width: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            height: (elevatorImage.height - elevator.bottomCrop) * GameSettings.GAME.GAME_SCALE,
        });
    }
}
