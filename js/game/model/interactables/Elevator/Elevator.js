import ElevatorBaseState from './state/ElevatorBaseState.js';
import ElevatorMountedTopState from './state/ElevatorMountedTopState.js';
import ElevatorMoveState from './state/ElevatorMoveState.js';
import ElevatorMountedDownState from './state/ElevatorMountedDownState.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import GameSettings from '../../../constants.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import Game from '../../game/Game.js';
export default class Elevator {
    constructor(position, interactableEventEmitter) {
        this._position = position;
        this.interactableEventEmitter = interactableEventEmitter;
        this._width = 0;
        this._height = 0;
        this._travelDistance = 0;
        this._stageLocation = 1;
        this._bottomCrop = 0;
        this.currState = new ElevatorBaseState();
        this.mountedDownState = new ElevatorMountedDownState();
        this.mountedTopState = new ElevatorMountedTopState();
        this.moveState = new ElevatorMoveState();
        this.interactionDistance = GameSettings.PLAYER.INTERACTION_MAX_DISTANCE;
        this.switchState(this.mountedTopState);
    }
    get stageLocation() {
        return this._stageLocation;
    }
    get travelDistance() {
        return this._travelDistance;
    }
    set travelDistance(value) {
        this._travelDistance = value;
    }
    get position() {
        return this._position;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get bottomCrop() {
        return this._bottomCrop;
    }
    set bottomCrop(value) {
        this._bottomCrop = value;
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
    changeStage() {
        this._travelDistance = 0;
        this._stageLocation = 2;
    }
    detectInteraction(position) {
        if (Game.getInstance().coinCount < 10) {
            return false;
        }
        if (Game.getInstance().player.isInElevator()) {
            return false;
        }
        const distance = DistanceHelper.getMagnitude(Vector.parse({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        }));
        return distance < this.interactionDistance;
    }
    activate() {
        this.interactableEventEmitter.notify('elevator:move', this);
        this.switchState(this.moveState);
    }
}
