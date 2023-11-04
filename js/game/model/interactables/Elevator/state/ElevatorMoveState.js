import ElevatorBaseState from './ElevatorBaseState.js';
import Game from '../../../Game/Game.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
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

        const { movementDeltaTime, deltaTime } = Game.getInstance();

        const velocity = this.velocity * movementDeltaTime;
        player.velocity.y = 0;
        if (this.counter > 140) {
            player.velocity.y = velocity;
        }

        player.centerPosition.y += velocity;
        elevator.position.y += velocity;
        elevator.travelDistance += velocity;

        if (this.aboutToMount) {
            elevator.bottomCrop += velocity * 0.415;
            this.bottomCropAmount += velocity * 0.415;
        }

        if (elevator.stageLocation === 2) {
            this.counter += deltaTime;
        }

        if (this.velocity === 0) {
            elevator.switchState(elevator.mountedDownState);
        }
    }

    handleVelocity(elevator) {
        const { deltaTime, movementDeltaTime } = Game.getInstance();
        if (elevator.stageLocation === 2 && elevator.travelDistance > 650) {
            this.velocity = this.velocity * (1 - this.frictionCoefficient * movementDeltaTime);

            if (elevator.travelDistance > 683) {
                this.aboutToMount = true;
            }

            if (this.velocity <= 0.01) {
                this.velocity = 0;
            }

            if (this.bottomCropAmount < 10) {
                this.velocity = 0.6 * movementDeltaTime;
                return;
            }

            this.velocity = 0;

            return;
        }

        this.velocity += 0.1 * movementDeltaTime;

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
