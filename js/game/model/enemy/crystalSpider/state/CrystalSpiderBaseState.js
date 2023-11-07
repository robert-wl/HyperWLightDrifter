import Animateable from '../../../utility/Animateable.js';
export default class CrystalSpiderBaseState extends Animateable {
    updateState(currSpider) {
        this.updateNumberCounter();
    }
    drawImage(currSpider) { }
    enterState(currSpider) {
        this.number = 0;
        this.animationStage = 1;
    }
    exitState(currSpider) { }
}
