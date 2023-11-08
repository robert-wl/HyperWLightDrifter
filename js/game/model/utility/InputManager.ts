import Game from '../game/Game.js';
import detectCheatCode from '../../helper/cheatCodeHelper.js';
import GameSettings from '../../constants.js';
import Observable from './Observable.js';
import { Vector } from './enums/Vector.js';

export default class InputManager {
    private readonly game: Game;
    private readonly _eventEmitter: Observable;
    private readonly validInputs: string[] = [];

    public constructor(game: Game) {
        this.game = game;
        this._eventEmitter = new Observable();
        this.validInputs = GameSettings.GAME.INPUT;

        this.eventHandler();
    }

    get eventEmitter(): Observable {
        return this._eventEmitter;
    }

    private eventHandler() {
        $(document).on('keydown', (e) => {
            const key = e.key.toLowerCase();

            detectCheatCode(key);

            if (this.validInputs.includes(key)) {
                this._eventEmitter.notify('keydown', key);
            }
        });

        $(document).on('keyup', (e) => {
            const key = e.key.toLowerCase();

            if (this.validInputs.includes(key)) {
                this._eventEmitter.notify('keyup', key);
            }
        });

        $(document).on('mousedown', (e) => {
            const click = this.convertClicksToKeys(e.which);

            if (click) {
                this._eventEmitter.notify('mousedown', click);
            }
        });

        $(document).on('mouseup', (e) => {
            const click = this.convertClicksToKeys(e.which);

            if (click) {
                this._eventEmitter.notify('mouseup', click);
            }
        });

        $(document).on('contextmenu', (e) => {
            e.preventDefault();
        });

        $(document).on('mousemove', (e) => {
            const { canvas, camera } = this.game;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left + camera.position.x;
            const y = e.clientY - rect.top + camera.position.y;

            this._eventEmitter.notify('mousemove', { x, y } as Vector);
        });
    }

    private convertClicksToKeys(click: number) {
        if (click === 1) {
            return 'left';
        }
        if (click === 2) {
            return 'middle';
        }
        if (click === 3) {
            return 'right';
        }

        return null;
    }
}
