import PlayerBaseState from './PlayerBaseState.js';
import { get_image } from '../../../helper/fileReader.js';
import { getMoveDirection } from '../../../helper/collision/directionHandler.js';
import Game from '../../Game.js';

const size = 1;
export default class PlayerMoveState extends PlayerBaseState {
    number = 0;

    updateState(currPlayer) {
        if(currPlayer.stamina < 100){
            currPlayer.stamina += 0.5;
        }
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

        currPlayer.handleSwitchState({
            move: true,
            attackOne: true,
            dash: true,
            aim: true,
        });
    }
    drawImage(currPlayer) {
        if (this.direction === 'w') {
            get_image('player/move', 'run_up', (this.number % 12) + 1, function (img) {
                currPlayer.canvas.drawImage(
                    img,
                    currPlayer.position.x,
                    currPlayer.position.y,
                    img.width * size,
                    img.height * size
                );
            });
            return;
        }
        if (this.direction === 's') {
            get_image('player/move', 'run_down', (this.number % 12) + 1, function (img) {
                currPlayer.canvas.drawImage(
                    img,
                    currPlayer.position.x,
                    currPlayer.position.y,
                    img.width * size,
                    img.height * size
                );
            });
            return;
        }
        if (this.direction === 'd') {
            get_image('player/move', 'run_right', (this.number % 12) + 1, function (img) {
                currPlayer.canvas.drawImage(
                    img,
                    currPlayer.position.x - 10,
                    currPlayer.position.y,
                    img.width * size,
                    img.height * size
                );
            });
            return;
        }
        if (this.direction === 'a') {
            get_image('player/move', 'run_left', (this.number % 12) + 1, function (img) {
                currPlayer.canvas.drawImage(
                    img,
                    currPlayer.position.x + 10,
                    currPlayer.position.y,
                    img.width * size,
                    img.height * size
                );
            });
        }
    }
}
