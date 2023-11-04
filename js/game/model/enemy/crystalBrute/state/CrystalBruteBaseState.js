import Animateable from '../../../Animateable.js';

export default class CrystalBruteBaseState extends Animateable {
    exitState(_currBrute) {}

    updateState(_currBrute) {
        this.updateNumberCounter();
    }

    drawImage(_currBrute) {}
    
    enterState(_currBrute) {
        this.number = 0;
        this.animationStage = 1;
    }
}
