import PlayerBaseState from './PlayerBaseState.js';
import { get_image } from '../../../helper/fileReader.js';

const size = 1;
export default class PlayerIdleState extends PlayerBaseState {
    updateState(currPlayer) {
        if (currPlayer.counter !== 6) {
            return;
        }

        currPlayer.handleSwitchState({ move: true, attackOne: true, dash: true });
    }
    drawImage(currPlayer) {
        if (currPlayer.lastDirection === 'd') {
            get_image('move', 'walk_right', 5, function (img) {
                if (currPlayer.direction) {
                    currPlayer.canvas.drawImage(
                        img,
                        currPlayer.position.x - 10,
                        currPlayer.position.y,
                        img.width * size,
                        img.height * size
                    );
                }
            });
        } else if (currPlayer.lastDirection === 'a') {
            get_image('move', 'walk_left', 5, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x + 10, currPlayer.position.y, img.width * size, img.height * size);
            });
        } else if (currPlayer.lastDirection === 's') {
            get_image('move', 'walk_down', 6, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
        } else if (currPlayer.lastDirection === 'w') {
            get_image('move', 'walk_up', 5, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
        }
    }
    enterState(currPlayer) {}
    exitState(currPlayer) {}
}
