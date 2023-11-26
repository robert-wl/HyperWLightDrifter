import Medkit from './Medkit.js';
import Coin from './Coin.js';
import Elevator from './Elevator/Elevator.js';
import { Vector } from '../utility/interfaces/Vector.js';
import Observable from '../utility/Observable.js';
import RandomHelper from '../utility/helper/RandomHelper.js';

export default class InteractablesFactory {
    private readonly eventEmitter: Observable;

    public constructor(eventEmitter: Observable) {
        this.eventEmitter = eventEmitter;
    }

    public generateCoin(position: Vector) {
        const x = Math.round(position.x / 256);
        const y = Math.round(position.y / 256);
        const key = `${y},${x}`;

        const coinObject = new Coin(position, 10, 10, key, this.eventEmitter);

        this.eventEmitter.notify('addInteractable:coin', coinObject);
    }

    public generateMedkit(position: Vector, key: string) {
        const angle = RandomHelper.randomValue(0, 4) * Math.PI;

        position = new Vector(position.x, position.y).add(new Vector(Math.cos(angle) * 100, Math.sin(angle) * 100));

        const medkit = new Medkit(position, 10, 10, key, this.eventEmitter);

        this.eventEmitter.notify('addInteractable', medkit);

        return medkit;
    }

    public generateElevator(position: Vector) {
        const elevator = new Elevator(position, this.eventEmitter);

        this.eventEmitter.notify('addInteractable', elevator);

        return elevator;
    }
}
