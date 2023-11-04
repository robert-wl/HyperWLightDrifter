import Animateable from '../../../Animateable.js';

export default class ElevatorBaseState extends Animateable {
    enterState(_elevator) {
        this.number = 0;
    }

    exitState(_elevator) {}

    drawImage(_elevator) {}

    updateState(_elevator) {
        this.updateNumberCounter();
    }
}
