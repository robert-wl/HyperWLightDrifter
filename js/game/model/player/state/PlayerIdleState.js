import PlayerBaseState from './PlayerBaseState.js';
import { get_image } from '../../../helper/fileReader.js';

const size = 1;
export default class PlayerIdleState extends PlayerBaseState {
    updateState(currPlayer) {
        if (currPlayer.stamina < 100) {
            currPlayer.stamina += 0.5;
        }
        if (currPlayer.counter !== 6) {
            return;
        }

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
            throws: true,
        });
    }
    drawImage(currPlayer) {
        if (currPlayer.lastDirection === 'd') {
            get_image('player/idle', 'idle_right', null, function (img) {
                if (currPlayer.direction) {
                    currPlayer.canvas.drawImage(img, currPlayer.position.x - 10, currPlayer.position.y, img.width * size, img.height * size);
                }
            });
        } else if (currPlayer.lastDirection === 'a') {
            get_image('player/idle', 'idle_left', null, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x + 10, currPlayer.position.y, img.width * size, img.height * size);
            });
        } else if (currPlayer.lastDirection === 's') {
            get_image('player/idle', 'idle_down', null, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
        } else if (currPlayer.lastDirection === 'w') {
            get_image('player/idle', 'idle_up', null, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
        }
    }
}
