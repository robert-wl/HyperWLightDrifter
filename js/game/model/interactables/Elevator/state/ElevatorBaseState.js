import Animateable from '../../../utility/Animateable.js';
export default class ElevatorBaseState extends Animateable {
    enterState(elevator) { }
    exitState(elevator) { }
    drawImage(elevator) { }
    updateState(elevator) {
        this.updateNumberCounter();
    }
}
