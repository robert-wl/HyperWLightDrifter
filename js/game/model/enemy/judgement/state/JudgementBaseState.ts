import Animateable from '../../../utility/Animateable.js';
import Judgement from '../Judgement.js';

export default class JudgementBaseState extends Animateable {
    public updateState(currJudgement: Judgement) {
        this.updateNumberCounter();
    }

    public drawImage(currJudgement: Judgement) {}

    public enterState(currJudgement: Judgement) {
        this.number = 0;
        this.animationStage = 1;
    }

    public exitState(currJudgement: Judgement) {}
}
