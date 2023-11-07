import { getRandomValue } from '../../helper/randomHelper.js';
import Medkit from './Medkit.js';
import Game from '../game/Game.js';
import Key from './Key.js';
import Elevator from './Elevator/Elevator.js';

export default class InteractablesFactory {
    private readonly game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public generateKey(position: Position) {
        const x = Math.round(position.x / 256);
        const y = Math.round(position.y / 256);
        const key = `${y},${x}`;

        const keyObject = new Key(position, 10, 10, key);

        const { coins } = this.game;
        coins.push(keyObject);
    }

    public generateMedkit(position: Position, key: string) {
        const angle =
            getRandomValue({
                initialValue: 0,
                randomValue: 4,
            }) * Math.PI;

        position = {
            x: position.x + Math.cos(angle) * 100,
            y: position.y + Math.sin(angle) * 100,
        };

        return new Medkit(position, 10, 10, key);
    }

    public generateElevator(position: Position) {
        return new Elevator(position);
    }
}
