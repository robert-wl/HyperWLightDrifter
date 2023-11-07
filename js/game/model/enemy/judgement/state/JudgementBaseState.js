import Animateable from '../../../utility/Animateable.js';

export default class JudgementBaseState extends Animateable {
    updateState() {
        this.updateNumberCounter();
    }

    drawImage() {}

    enterState() {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState() {}
}
