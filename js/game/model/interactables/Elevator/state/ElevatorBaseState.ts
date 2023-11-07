import Animateable from '../../../utility/Animateable.js';
import Elevator from '../Elevator.js';

export default class ElevatorBaseState extends Animateable {
    public enterState(elevator: Elevator) {}

    public exitState(elevator: Elevator) {}

    public drawImage(elevator: Elevator) {}

    public updateState(elevator: Elevator) {}
}
