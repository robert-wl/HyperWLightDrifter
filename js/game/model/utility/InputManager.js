import Observable from './Observable.js';
import { Vector } from './interfaces/Vector.js';
import GameSettings from '../../constants.js';
export default class InputManager {
    constructor(game) {
        this.game = game;
        this._inputObservable = new Observable();
        this.eventHandler();
    }
    get inputObservable() {
        return this._inputObservable;
    }
    eventHandler() {
        $(document)
            .off('keydown.inputManager')
            .on('keydown.inputManager', (e) => {
            const key = e.key.toLowerCase();
            this._inputObservable.notify('keydown', key);
        });
        $(document)
            .off('keyup.inputManager')
            .on('keyup.inputManager', (e) => {
            const key = e.key.toLowerCase();
            this._inputObservable.notify('keyup', key);
        });
        $(document)
            .off('mousedown.inputManager')
            .on('mousedown.inputManager', (e) => {
            const click = this.convertClicksToKeys(e.which);
            if (click) {
                this._inputObservable.notify('mousedown', click);
            }
        });
        $(document)
            .off('mouseup.inputManager')
            .on('mouseup.inputManager', (e) => {
            const click = this.convertClicksToKeys(e.which);
            if (click) {
                this._inputObservable.notify('mouseup', click);
            }
        });
        $(document)
            .off('contextmenu.inputManager')
            .on('contextmenu.inputManager', (e) => {
            e.preventDefault();
        });
        $(document)
            .off('mousemove.inputManager')
            .on('mousemove.inputManager', (e) => {
            const { canvas, camera } = this.game;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - window.innerWidth / 2 + camera.position.x * GameSettings.GAME.GAME_SCALE + 950;
            const y = e.clientY - rect.top - window.innerHeight / 2 + camera.position.y * GameSettings.GAME.GAME_SCALE + 600;
            this._inputObservable.notify('mousemove', new Vector(x, y));
        });
    }
    convertClicksToKeys(click) {
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
