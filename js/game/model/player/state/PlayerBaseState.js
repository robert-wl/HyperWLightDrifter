import Game from '../../Game/Game.js';

export default class PlayerBaseState {
    number = 0;
    animationStage = 1;

    updateState(currPlayer) {
        const { deltaTime } = Game.getInstance();
        this.number += deltaTime;
    }

    drawImage(currPlayer) {
    }

    enterState(currPlayer) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(currPlayer) {
    }


    checkCounter(number) {
        return this.number >= number;
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
}
