import PlayerBaseState from './PlayerBaseState.js';
import { get_image } from '../../../helper/fileReader.js';
import { getMoveDirection } from '../../../helper/directionHandler.js';
import Game from '../../Game.js';

const size = 1;
export default class PlayerMoveState extends PlayerBaseState {
    number = 0;

    updateState(currPlayer) {
        const {direction, playerDirection } = getMoveDirection({
            keys: Game.getInstance().keys,
            currPlayer,
        });

        this.direction = direction;
        currPlayer.direction = playerDirection;
        if(direction) {
            currPlayer.lastDirection = direction;
        }

        // console.log(currPlayer.counter)
        if (currPlayer.counter % 6 !== 0) {
            return;
        }
        this.number += 1;

        currPlayer.handleSwitchState({ move: true, attackOne: true, dash: true });
    }
    drawImage(currPlayer) {
        if (this.direction === 'w') {
            if (currPlayer.direction.y < -3) {
                get_image('move', 'run_up', (this.number % 12) + 1, function (img) {
                    currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
                });
                return;
            }
            get_image('move', 'walk_up', (this.number % 10) + 1, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
            return;
        }
        if (this.direction === 's') {
            if (currPlayer.direction.y > 3) {
                get_image('move', 'run_down', (this.number % 12) + 1, function (img) {
                    currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
                });
                return;
            }
            get_image('move', 'walk_down', (this.number % 10) + 1, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x, currPlayer.position.y, img.width * size, img.height * size);
            });
            return;
        }
        if (this.direction === 'd') {
            if (currPlayer.direction.x > 3) {
                get_image('move', 'run_right', (this.number % 12) + 1, function (img) {
                    currPlayer.canvas.drawImage(img, currPlayer.position.x - 10, currPlayer.position.y, img.width * size, img.height * size);
                });
                return;
            }
            get_image('move', 'walk_right', (this.number % 10) + 1, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x - 10, currPlayer.position.y, img.width * size, img.height * size);
            });
            return;
        }
        if (this.direction === 'a') {
            if (currPlayer.direction.x < -3) {
                get_image('move', 'run_left', (this.number % 12) + 1, function (img) {
                    currPlayer.canvas.drawImage(img, currPlayer.position.x + 10, currPlayer.position.y, img.width * size, img.height * size);
                });
                return;
            }
            get_image('move', 'walk_left', (this.number % 10) + 1, function (img) {
                currPlayer.canvas.drawImage(img, currPlayer.position.x + 10, currPlayer.position.y, img.width * size, img.height * size);
            });
        }
    }
    enterState(currPlayer) {
        /* TODO document why this method 'enterState' is empty */
    }
    exitState(currPlayer) {
        /* TODO document why this method 'enterState' is empty */
    }
}
