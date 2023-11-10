import Game from '../Game.js';
export default class GameBaseState {
    constructor() {
        this.number = 0;
    }
    enterState(game) {
        this.number = 0;
    }
    updateState(game) {
        if (Game.deltaTime) {
            this.number += Game.deltaTime;
        }
    }
    exitState(game) { }
    checkCounter(number) {
        return this.number >= number;
    }
    resetCounter() {
        this.number = 0;
    }
}
