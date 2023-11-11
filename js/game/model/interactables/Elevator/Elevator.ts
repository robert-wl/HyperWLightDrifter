import ElevatorBaseState from './state/ElevatorBaseState.js';
import ElevatorMountedTopState from './state/ElevatorMountedTopState.js';
import ElevatorMoveState from './state/ElevatorMoveState.js';
import ElevatorMountedDownState from './state/ElevatorMountedDownState.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import Observable from '../../utility/Observable.js';
import GameSettings from '../../../constants.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import Game from '../../game/Game.js';

export default class Elevator {
    public currState: ElevatorBaseState;
    public mountedDownState: ElevatorMountedDownState;
    public mountedTopState: ElevatorMountedTopState;
    public moveState: ElevatorMoveState;
    private readonly _position: Vector;
    private interactableEventEmitter: Observable;
    private _width: number;
    private _height: number;
    private _travelDistance: number;
    private _stageLocation: number;
    private _bottomCrop: number;
    private readonly interactionDistance: number;

    public constructor(position: Vector, interactableEventEmitter: Observable) {
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

    get stageLocation(): number {
        return this._stageLocation;
    }

    get travelDistance(): number {
        return this._travelDistance;
    }

    set travelDistance(value: number) {
        this._travelDistance = value;
    }

    get position(): Vector {
        return this._position;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get bottomCrop(): number {
        return this._bottomCrop;
    }

    set bottomCrop(value: number) {
        this._bottomCrop = value;
    }

    public update() {
        this.currState.updateState(this);
        this.currState.drawImage(this);
    }

    public switchState(nextState: ElevatorBaseState) {
        this.currState.exitState(this);
        this.currState = nextState;
        this.currState.enterState(this);
    }

    public changeStage() {
        this._travelDistance = 0;
        this._stageLocation = 2;
    }

    public detectInteraction(position: Vector) {
        if (Game.getInstance().coinCount < 10) {
            return false;
        }
        if (Game.getInstance().player.isInElevator()) {
            return false;
        }

        const distance = DistanceHelper.getMagnitude({
            x: position.x - (this.position.x + this.width / 2),
            y: position.y - (this.position.y + this.height / 2),
        });

        return distance < this.interactionDistance;
    }

    public activate() {
        this.interactableEventEmitter.notify('elevator:move', this);
        this.switchState(this.moveState);
    }
}
