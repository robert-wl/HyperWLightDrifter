import Animateable from '../../../utility/Animateable.js';
export default class JudgementBaseState extends Animateable {
    updateState(currJudgement) {
        this.updateNumberCounter();
    }
    drawImage(currJudgement) { }
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
    }
    exitState(currJudgement) { }
}
