import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import Observable from './Observable.js';
import { Vector } from './interfaces/Vector.js';

export default class InputManager {
    private readonly game: Game;
    private readonly _inputObservable: Observable;

    public constructor(game: Game) {
        this.game = game;
        this._inputObservable = new Observable();
        this.eventHandler();
    }

    get inputObservable(): Observable {
        return this._inputObservable;
    }

    private eventHandler() {
        $(document).on('keydown', (e) => {
            const key = e.key.toLowerCase();

            if (key === 'f') {
                Game.getInstance().keyCount += 10;
            }

            this._inputObservable.notify('keydown', key);
        });

        $(document).on('keyup', (e) => {
            const key = e.key.toLowerCase();

            this._inputObservable.notify('keyup', key);
        });

        $(document).on('mousedown', (e) => {
            const click = this.convertClicksToKeys(e.which);

            if (click) {
                this._inputObservable.notify('mousedown', click);
            }
        });

        $(document).on('mouseup', (e) => {
            const click = this.convertClicksToKeys(e.which);

            if (click) {
                this._inputObservable.notify('mouseup', click);
            }
        });

        $(document).on('contextmenu', (e) => {
            e.preventDefault();
        });

        $(document).on('mousemove', (e) => {
            const { canvas, camera } = this.game;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left + camera.position.x * GameSettings.GAME.GAME_SCALE;
            const y = e.clientY - rect.top + camera.position.y * GameSettings.GAME.GAME_SCALE + 200;

            this._inputObservable.notify('mousemove', { x, y } as Vector);
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
