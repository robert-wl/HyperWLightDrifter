import Animateable from '../../../Animateable.js';
import Game from '../../../Game/Game.js';


export default class ElevatorBaseState extends Animateable {
    enterState(elevator) {
        this.number = 0;
    }

    updateState(elevator) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }

    drawImage(elevator) {

    }

    exitState(elevator) {

    }
}
