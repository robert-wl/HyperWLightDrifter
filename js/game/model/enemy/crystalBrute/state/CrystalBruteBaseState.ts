import Animateable from '../../../utility/Animateable.js';
import CrystalBrute from '../CrystalBrute';

export default class CrystalBruteBaseState extends Animateable {
    public exitState(currBrute: CrystalBrute) {}

    public updateState(currBrute: CrystalBrute) {
        this.updateNumberCounter();
    }

    public drawImage(currBrute: CrystalBrute) {}

    public enterState(currBrute: CrystalBrute) {
        this.number = 0;
        this.animationStage = 1;
    }
}
