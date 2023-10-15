import Animateable from '../../../Animateable.js';

export default class CrystalBruteBaseState extends Animateable {
    updateState(currBrute) {
        this.updateNumberCounter();
    }

    drawImage(currBrute) {}

    enterState(currBrute) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(currBrute) {}
}
