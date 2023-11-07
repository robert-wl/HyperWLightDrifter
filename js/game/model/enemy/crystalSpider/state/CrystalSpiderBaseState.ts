import Animateable from '../../../utility/Animateable.js';
import CrystalSpider from '../CrystalSpider.js';

export default class CrystalSpiderBaseState extends Animateable {
    public updateState(currSpider: CrystalSpider) {
        this.updateNumberCounter();
    }

    public drawImage(currSpider: CrystalSpider) {}

    public enterState(currSpider: CrystalSpider) {
        this.number = 0;
        this.animationStage = 1;
    }

    public exitState(currSpider: CrystalSpider) {}
}
