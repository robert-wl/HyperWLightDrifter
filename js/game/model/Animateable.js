import Game from './Game/Game.js';

export default class Animateable {
    number = 0;
    animationStage = 1;

    checkCounter(number) {
        return this.number >= number;
    }

    checkCounterReversed(number) {
        return this.number <= number;
    }

    advanceAnimationStage(number, maxStage) {
        const advanceStage = Math.floor(this.number / number);

        if (advanceStage > 0) {
            this.animationStage += advanceStage;
            this.number = 0;

            if (maxStage && this.animationStage > maxStage) {
                this.animationStage = 1;
            }
        }
    }

    updateNumberCounter() {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }
}