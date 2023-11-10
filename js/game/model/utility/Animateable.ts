import Game from '../game/Game.js';

export default class Animateable {
    protected number = 0;
    protected animationStage = 1;

    protected checkCounter(number: number) {
        return this.number >= number;
    }

    protected checkCounterReversed(number: number) {
        return this.number <= number;
    }

    protected advanceAnimationStage(number: number, maxStage?: number) {
        const advanceStage = Math.floor(this.number / number);

        if (advanceStage > 0) {
            this.animationStage += 1;
            this.number = 0;

            if (maxStage && this.animationStage > maxStage) {
                this.animationStage = 1;
            }
        }
    }

    protected updateNumberCounter() {
        this.number += Game.deltaTime;
    }
}
