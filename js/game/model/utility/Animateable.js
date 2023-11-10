import Game from '../game/Game.js';
export default class Animateable {
    constructor() {
        this.number = 0;
        this.animationStage = 1;
    }
    checkCounter(number) {
        return this.number >= number;
    }
    checkCounterReversed(number) {
        return this.number <= number;
    }
    advanceAnimationStage(number, maxStage) {
        const advanceStage = Math.floor(this.number / number);
        if (advanceStage > 0) {
            this.animationStage += 1;
            this.number = 0;
            if (maxStage && this.animationStage > maxStage) {
                this.animationStage = 1;
            }
        }
    }
    updateNumberCounter() {
        this.number += Game.deltaTime;
    }
}
