import Game from '../Game.js';

export default class GameBaseState {
    protected number = 0;

    public async enterState(game: Game) {
        this.number = 0;
    }

    public updateState(game: Game) {
        if (Game.deltaTime) {
            this.number += Game.deltaTime;
        }
    }

    public async exitState(game: Game) {}

    protected checkCounter(number: number) {
        return this.number >= number;
    }

    protected resetCounter() {
        this.number = 0;
    }
}
