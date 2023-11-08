import Game from '../Game';

export default class GameBaseState {
    protected number = 0;

    public enterState(game: Game) {
        this.number = 0;
    }

    public updateState(game: Game) {
        const { deltaTime } = game;
        if (deltaTime) {
            this.number += deltaTime;
        }
    }

    public exitState(game: Game) {}

    protected checkCounter(number: number) {
        return this.number >= number;
    }

    protected resetCounter() {
        this.number = 0;
    }
}
