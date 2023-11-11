import Medkit from './Medkit.js';
import Coin from './Coin.js';
import Elevator from './Elevator/Elevator.js';
import RandomHelper from '../utility/helper/RandomHelper.js';
export default class InteractablesFactory {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    generateCoin(position) {
        const x = Math.round(position.x / 256);
        const y = Math.round(position.y / 256);
        const key = `${y},${x}`;
        const coinObject = new Coin(position, 10, 10, key, this.eventEmitter);
        this.eventEmitter.notify('addInteractable:coin', coinObject);
    }
    generateMedkit(position, key) {
        const angle = RandomHelper.randomValue(0, 4) * Math.PI;
        position = {
            x: position.x + Math.cos(angle) * 100,
            y: position.y + Math.sin(angle) * 100,
        };
        const medkit = new Medkit(position, 10, 10, key, this.eventEmitter);
        this.eventEmitter.notify('addInteractable', medkit);
        return medkit;
    }
    generateElevator(position) {
        const elevator = new Elevator(position, this.eventEmitter);
        this.eventEmitter.notify('addInteractable', elevator);
        return elevator;
    }
}
