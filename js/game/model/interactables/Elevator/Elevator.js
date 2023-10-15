import ElevatorBaseState from './state/ElevatorBaseState.js';
import ElevatorMountedTopState from './state/ElevatorMountedTopStage.js';
import ElevatorMoveState from './state/ElevatorMoveState.js';
import ElevatorMountedDownState from './state/ElevatorMountedDownState.js';
import InteractionBar from '../InteractionBar.js';

export default class Elevator {
    constructor({ x, y }) {
        this.x = x;
        this.y = y;
        this.position = {
            x: x,
            y: y,
        };
        this.width = 0;
        this.height = 0;
        this.interactionStage = 0;
        this.travelDistance = 0;
        this.stageLocation = 1;
        this.bottomCrop = 0;
        this.currState = new ElevatorBaseState();
        this.mountedDownState = new ElevatorMountedDownState();
        this.mountedTopState = new ElevatorMountedTopState();
        this.moveState = new ElevatorMoveState();
        this.switchState(this.mountedTopState);
    }

    update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
    }

    switchState(nextState) {
        this.currState.exitState(this);
        this.currState = nextState;
        this.currState.enterState(this);
    }

    detectInteraction() {
        InteractionBar.detectPlayerInteraction(this);
    }

    changeStage() {
        this.travelDistance = 0;
        this.stageLocation = 2;
    }

    activate() {
        this.switchState(this.moveState);
    }
}
