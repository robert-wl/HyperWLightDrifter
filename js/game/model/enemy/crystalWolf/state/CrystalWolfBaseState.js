import Animateable from '../../../Animateable.js';

export default class CrystalWolfBaseState extends Animateable {
    updateState(currWolf) {
        this.updateNumberCounter();
    }

    drawImage(currWolf) {}

    enterState(currWolf) {
        this.number = 0;
        this.animationStage = 1;
    }

    exitState(currWolf) {}
}
