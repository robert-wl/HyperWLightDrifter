export default class GameBaseState {
    number = 0;

    enterState(game) {
        this.number = 0;
    }

    updateState(game) {
        const { deltaTime } = game;
        if (deltaTime) {
            this.number += deltaTime;
        }
    }

    exitState(game) {
    }

    checkCounter(number) {
        return this.number >= number;
    }

    resetCounter() {
        this.number = 0;
    }
}
