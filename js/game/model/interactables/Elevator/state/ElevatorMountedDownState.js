import ElevatorBaseState from './ElevatorBaseState.js';
import GameSettings from '../../../../constants.js';
import Game from '../../../game/Game.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
export default class ElevatorMountedDownState extends ElevatorBaseState {
    enterState(elevator) {
        const { player, camera } = Game.getInstance();
        player.switchState(player.idleState);
        camera.switchState(camera.normalState);
        AudioManager.playAudio('elevator_mount_audio').then();
    }
    drawImage(elevator) {
        const elevatorImage = AssetManager.getImage('elevator');
        elevator.width = -0.5 * elevatorImage.width;
        elevator.height = -2 * elevatorImage.height;
        const imageBox = Box.parse({
            x: 0,
            y: 0,
            w: elevatorImage.width,
            h: elevatorImage.height - elevator.bottomCrop,
        });
        const drawBox = Box.parse({
            x: elevator.position.x - elevatorImage.width,
            y: elevator.position.y - elevatorImage.height,
            w: elevatorImage.width * GameSettings.GAME.GAME_SCALE,
            h: (elevatorImage.height - elevator.bottomCrop) * GameSettings.GAME.GAME_SCALE,
        });
        DrawHelper.drawImageCropped(elevatorImage, imageBox, drawBox);
    }
}
