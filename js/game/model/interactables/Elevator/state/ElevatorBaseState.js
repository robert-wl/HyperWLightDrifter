import Animateable from '../../../Animateable.js';


export default class ElevatorBaseState extends Animateable {
    enterState(elevator) {
        this.number = 0;
    }

    updateState(elevator) {
        this.updateNumberCounter();
    }

    drawImage(elevator) {

    }

    exitState(elevator) {

    }
}
