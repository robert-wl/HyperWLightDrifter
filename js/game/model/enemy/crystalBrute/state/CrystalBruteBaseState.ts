import Animateable from '../../../utility/Animateable.js';
import CrystalBrute from '../CrystalBrute';

export default class CrystalBruteBaseState extends Animateable {
    exitState(currBrute: CrystalBrute) {}

    updateState(currBrute: CrystalBrute) {
        this.updateNumberCounter();
    }

    drawImage(currBrute: CrystalBrute) {}

    enterState(currBrute: CrystalBrute) {
        this.number = 0;
        this.animationStage = 1;
    }
}
