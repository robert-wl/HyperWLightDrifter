import Animateable from '../../../utility/Animateable.js';
export default class JudgementBaseState extends Animateable {
    updateState(currJudgement) {
        this.updateNumberCounter();
    }
    exitState(currJudgement) { }
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
    }
    drawImage(currJudgement) { }
}
